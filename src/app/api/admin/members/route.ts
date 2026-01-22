import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { checkAdminRole } from '@/lib/middleware/admin-check'

export async function GET() {
  const supabase = await createClient()

  const adminCheck = await checkAdminRole(supabase)
  if (adminCheck.error) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  const { data: members, error } = await supabase
    .from('users')
    .select('*')
    .order('display_name', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }

  return NextResponse.json(members)
}
