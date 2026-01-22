import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkAdminRole } from '@/lib/middleware/admin-check'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const adminCheck = await checkAdminRole(supabase)
  if (adminCheck.error) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const limit = parseInt(searchParams.get('limit') ?? '20', 10)
  const type = searchParams.get('type')
  const offset = (page - 1) * limit

  let query = supabase
    .from('transactions')
    .select(
      `
      *,
      from_user:users!transactions_from_user_id_fkey(id, display_name),
      to_user:users!transactions_to_user_id_fkey(id, display_name),
      reward:rewards(id, name)
    `,
      { count: 'exact' }
    )

  if (type) {
    query = query.eq('type', type)
  }

  const { data: transactions, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }

  return NextResponse.json({
    data: transactions,
    pagination: {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  })
}
