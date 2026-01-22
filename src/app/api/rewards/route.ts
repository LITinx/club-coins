import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: rewards, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('is_active', true)
    .order('coin_cost', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch rewards' }, { status: 500 })
  }

  return NextResponse.json(rewards)
}
