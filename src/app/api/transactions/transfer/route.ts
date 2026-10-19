import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { transferSchema } from '@/lib/validations/transactions'

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Требуется вход в аккаунт' }, { status: 401 })
  }

  const body = await request.json()

  // Validate input
  const validation = transferSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.errors[0]?.message ?? 'Некорректные данные' },
      { status: 400 }
    )
  }

  const { toUserId, amount, description } = validation.data

  // Prevent self-transfer
  if (toUserId === user.id) {
    return NextResponse.json({ error: 'Нельзя перевести монеты самому себе' }, { status: 400 })
  }

  // Get sender's balance
  const { data: sender } = await supabase
    .from('users')
    .select('balance, status')
    .eq('id', user.id)
    .single()

  if (!sender || sender.status !== 'active') {
    return NextResponse.json({ error: 'Ваш аккаунт неактивен' }, { status: 400 })
  }

  // Check balance
  if (sender.balance < amount) {
    return NextResponse.json({ error: 'Недостаточно монет' }, { status: 400 })
  }

  // Check recipient exists and is active
  const { data: recipient } = await supabase
    .from('users')
    .select('id, status')
    .eq('id', toUserId)
    .single()

  if (!recipient) {
    return NextResponse.json({ error: 'Получатель не найден' }, { status: 404 })
  }

  if (recipient.status !== 'active') {
    return NextResponse.json({ error: 'Аккаунт получателя неактивен' }, { status: 400 })
  }

  // Use admin client to create transaction (trigger will handle balance updates)
  const adminSupabase = createAdminClient()

  const { data: transaction, error } = await adminSupabase
    .from('transactions')
    .insert({
      type: 'transfer',
      from_user_id: user.id,
      to_user_id: toUserId,
      amount,
      description: description ?? null,
    })
    .select()
    .single()

  if (error) {
    console.error('Transfer error:', error)
    return NextResponse.json({ error: 'Не удалось выполнить перевод' }, { status: 500 })
  }

  return NextResponse.json(transaction, { status: 201 })
}
