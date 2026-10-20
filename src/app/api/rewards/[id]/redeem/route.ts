import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(_request: Request, { params }: RouteParams) {
  const { id: rewardId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Требуется вход в аккаунт' }, { status: 401 })
  }

  // Get user's balance
  const { data: userProfile } = await supabase
    .from('users')
    .select('balance, status')
    .eq('id', user.id)
    .single()

  if (!userProfile || userProfile.status !== 'active') {
    return NextResponse.json({ error: 'Ваш аккаунт неактивен' }, { status: 400 })
  }

  // Get reward details
  const { data: reward } = await supabase
    .from('rewards')
    .select('*')
    .eq('id', rewardId)
    .eq('is_active', true)
    .single()

  if (!reward) {
    return NextResponse.json({ error: 'Награда не найдена' }, { status: 404 })
  }

  // Check inventory
  if (reward.inventory !== null && reward.inventory <= 0) {
    return NextResponse.json({ error: 'Награда закончилась' }, { status: 400 })
  }

  // Check balance
  if (userProfile.balance < reward.coin_cost) {
    return NextResponse.json({ error: 'Недостаточно монет' }, { status: 400 })
  }

  const adminSupabase = createAdminClient()

  // Database triggers deduct the balance and decrement inventory atomically
  const { data: transaction, error: txError } = await adminSupabase
    .from('transactions')
    .insert({
      type: 'redemption',
      from_user_id: user.id,
      to_user_id: user.id,
      amount: reward.coin_cost,
      reward_id: reward.id,
    })
    .select()
    .single()

  if (txError) {
    // Raised by decrement_reward_quantity() when someone else took the last item
    if (txError.message.includes('out of stock')) {
      return NextResponse.json({ error: 'Награда закончилась' }, { status: 400 })
    }
    console.error('Redemption transaction error:', txError)
    return NextResponse.json({ error: 'Не удалось обменять награду' }, { status: 500 })
  }

  return NextResponse.json(transaction, { status: 201 })
}
