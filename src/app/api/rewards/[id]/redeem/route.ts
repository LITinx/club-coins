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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user's balance
  const { data: userProfile } = await supabase
    .from('users')
    .select('balance, status')
    .eq('id', user.id)
    .single()

  if (!userProfile || userProfile.status !== 'active') {
    return NextResponse.json({ error: 'Account not active' }, { status: 400 })
  }

  // Get reward details
  const { data: reward } = await supabase
    .from('rewards')
    .select('*')
    .eq('id', rewardId)
    .eq('is_active', true)
    .single()

  if (!reward) {
    return NextResponse.json({ error: 'Reward not found' }, { status: 404 })
  }

  // Check inventory
  if (reward.inventory !== null && reward.inventory <= 0) {
    return NextResponse.json({ error: 'Reward out of stock' }, { status: 400 })
  }

  // Check balance
  if (userProfile.balance < reward.coin_cost) {
    return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
  }

  const adminSupabase = createAdminClient()

  // Start a transaction-like operation
  // 1. Create redemption transaction
  const { data: transaction, error: txError } = await adminSupabase
    .from('transactions')
    .insert({
      type: 'redemption',
      from_user_id: user.id,
      to_user_id: user.id,
      amount: reward.coin_cost,
      reward_id: reward.id,
      description: `Redeemed: ${reward.name}`,
    })
    .select()
    .single()

  if (txError) {
    console.error('Redemption transaction error:', txError)
    return NextResponse.json({ error: 'Failed to process redemption' }, { status: 500 })
  }

  // 2. Decrease inventory if applicable
  if (reward.inventory !== null) {
    const { error: invError } = await adminSupabase
      .from('rewards')
      .update({ inventory: reward.inventory - 1 })
      .eq('id', rewardId)

    if (invError) {
      console.error('Inventory update error:', invError)
    }
  }

  return NextResponse.json(transaction, { status: 201 })
}
