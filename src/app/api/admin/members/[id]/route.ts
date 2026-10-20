import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { checkAdminRole } from '@/lib/middleware/admin-check'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id: memberId } = await params
  const supabase = await createClient()

  const adminCheck = await checkAdminRole(supabase)
  if (adminCheck.error) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  // memberId is interpolated into a PostgREST filter below, so only accept a plain UUID
  if (!z.string().uuid().safeParse(memberId).success) {
    return NextResponse.json({ error: 'Некорректный идентификатор участника' }, { status: 400 })
  }

  if (memberId === adminCheck.userId) {
    return NextResponse.json({ error: 'Нельзя удалить собственный аккаунт' }, { status: 400 })
  }

  const adminSupabase = createAdminClient()

  // Transactions reference users without ON DELETE, and removing them would rewrite
  // other members' history, so only members without transactions can be deleted
  const { count, error: countError } = await adminSupabase
    .from('transactions')
    .select('id', { count: 'exact', head: true })
    .or(`from_user_id.eq.${memberId},to_user_id.eq.${memberId}`)

  if (countError) {
    console.error('Member transactions check error:', countError)
    return NextResponse.json({ error: 'Не удалось удалить участника' }, { status: 500 })
  }

  if (count) {
    return NextResponse.json(
      { error: 'У участника есть операции с монетами — удалить можно только участников без операций' },
      { status: 409 }
    )
  }

  // Deleting the auth user cascades to users and notifications
  const { error } = await adminSupabase.auth.admin.deleteUser(memberId)

  if (error) {
    console.error('Member delete error:', error)
    return NextResponse.json({ error: 'Не удалось удалить участника' }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
