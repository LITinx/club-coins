import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { checkAdminRole } from '@/lib/middleware/admin-check'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(_request: Request, { params }: RouteParams) {
  const { id: transactionId } = await params
  const supabase = await createClient()

  const adminCheck = await checkAdminRole(supabase)
  if (adminCheck.error) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  const adminSupabase = createAdminClient()

  const { data, error } = await adminSupabase
    .from('transactions')
    .update({ fulfilled_at: new Date().toISOString() })
    .eq('id', transactionId)
    .eq('type', 'redemption')
    .is('fulfilled_at', null)
    .select('id')

  if (error) {
    console.error('Fulfill redemption error:', error)
    return NextResponse.json({ error: 'Не удалось отметить выдачу' }, { status: 500 })
  }

  if (!data?.length) {
    return NextResponse.json({ error: 'Обмен не найден или уже выдан' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
