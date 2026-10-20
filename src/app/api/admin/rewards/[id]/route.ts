import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { checkAdminRole } from '@/lib/middleware/admin-check'
import { rewardUpdateSchema } from '@/lib/validations/rewards'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id: rewardId } = await params
  const supabase = await createClient()

  const adminCheck = await checkAdminRole(supabase)
  if (adminCheck.error) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  const body = await request.json()

  const validation = rewardUpdateSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.errors[0]?.message ?? 'Некорректные данные' },
      { status: 400 }
    )
  }

  const adminSupabase = createAdminClient()

  const { data: reward, error } = await adminSupabase
    .from('rewards')
    .update(validation.data)
    .eq('id', rewardId)
    .select()
    .single()

  if (error) {
    console.error('Update reward error:', error)
    return NextResponse.json({ error: 'Не удалось обновить награду' }, { status: 500 })
  }

  return NextResponse.json(reward)
}
