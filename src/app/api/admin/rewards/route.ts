import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { checkAdminRole } from '@/lib/middleware/admin-check'
import { rewardSchema } from '@/lib/validations/rewards'

export async function GET() {
  const supabase = await createClient()

  const adminCheck = await checkAdminRole(supabase)
  if (adminCheck.error) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  const { data: rewards, error } = await supabase
    .from('rewards')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Не удалось загрузить награды' }, { status: 500 })
  }

  return NextResponse.json(rewards)
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const adminCheck = await checkAdminRole(supabase)
  if (adminCheck.error) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  const body = await request.json()

  const validation = rewardSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.errors[0]?.message ?? 'Некорректные данные' },
      { status: 400 }
    )
  }

  const adminSupabase = createAdminClient()

  const { data: reward, error } = await adminSupabase
    .from('rewards')
    .insert(validation.data)
    .select()
    .single()

  if (error) {
    console.error('Create reward error:', error)
    return NextResponse.json({ error: 'Не удалось создать награду' }, { status: 500 })
  }

  return NextResponse.json(reward, { status: 201 })
}
