import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkAdminRole } from '@/lib/middleware/admin-check'
import { awardSchema } from '@/lib/validations/transactions'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id: targetUserId } = await params
  const supabase = await createClient()

  const adminCheck = await checkAdminRole(supabase)
  if (adminCheck.error) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  const body = await request.json()

  // Validate input
  const validation = awardSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.errors[0]?.message ?? 'Invalid input' },
      { status: 400 }
    )
  }

  const { amount, description } = validation.data

  // Check target user exists
  const { data: targetUser } = await supabase
    .from('users')
    .select('id, status')
    .eq('id', targetUserId)
    .single()

  const typedTargetUser = targetUser as { id: string; status: string } | null

  if (!typedTargetUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  if (typedTargetUser.status !== 'active') {
    return NextResponse.json({ error: 'Cannot award coins to inactive user' }, { status: 400 })
  }

  // Use admin client to bypass RLS for creating transaction
  const adminSupabase = createAdminClient()

  // Create award transaction (trigger will update balance and create notification)
  // Note: from_user_id is null for awards since coins are created, not transferred
  const { data: transaction, error } = await adminSupabase
    .from('transactions')
    .insert({
      type: 'award',
      from_user_id: null,
      to_user_id: targetUserId,
      amount,
      description: description ?? `Awarded by admin`,
    })
    .select()
    .single()

  if (error) {
    console.error('Award error:', error)
    return NextResponse.json({ error: 'Failed to award coins' }, { status: 500 })
  }

  return NextResponse.json(transaction, { status: 201 })
}
