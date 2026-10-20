import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Требуется вход в аккаунт' }, { status: 401 })
  }

  const { data: rewards, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('is_active', true)
    .order('coin_cost', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'Не удалось загрузить награды' }, { status: 500 })
  }

  return NextResponse.json(rewards)
}
