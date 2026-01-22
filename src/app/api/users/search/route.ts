import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json([])
  }

  const { data: users, error } = await supabase
    .from('users')
    .select('id, display_name, email')
    .eq('status', 'active')
    .or(`display_name.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(10)

  if (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }

  return NextResponse.json(users)
}
