import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { checkAdminRole } from '@/lib/middleware/admin-check'
import { z } from 'zod'

const roleSchema = z.object({
  role: z.enum(['student', 'volunteer', 'admin']),
})

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id: memberId } = await params
  const supabase = await createClient()

  const adminCheck = await checkAdminRole(supabase)
  if (adminCheck.error) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  const body = await request.json()

  const validation = roleSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.errors[0]?.message ?? 'Некорректные данные' },
      { status: 400 }
    )
  }

  // Prevent admin from removing their own admin rights
  if (memberId === adminCheck.userId) {
    return NextResponse.json({ error: 'Нельзя изменить собственную роль' }, { status: 400 })
  }

  const adminSupabase = createAdminClient()

  const { data: member, error } = await adminSupabase
    .from('users')
    .update({ role: validation.data.role })
    .eq('id', memberId)
    .select()
    .single()

  if (error) {
    console.error('Role update error:', error)
    return NextResponse.json({ error: 'Не удалось изменить роль' }, { status: 500 })
  }

  return NextResponse.json(member)
}
