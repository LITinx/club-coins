import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { checkAdminRole } from '@/lib/middleware/admin-check'
import { z } from 'zod'

const statusSchema = z.object({
  status: z.enum(['active', 'inactive']),
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

  const validation = statusSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.errors[0]?.message ?? 'Invalid input' },
      { status: 400 }
    )
  }

  // Prevent admin from deactivating themselves
  if (memberId === adminCheck.userId && validation.data.status === 'inactive') {
    return NextResponse.json(
      { error: 'Cannot deactivate your own account' },
      { status: 400 }
    )
  }

  const adminSupabase = createAdminClient()

  const { data: member, error } = await adminSupabase
    .from('users')
    .update({ status: validation.data.status })
    .eq('id', memberId)
    .select()
    .single()

  if (error) {
    console.error('Status update error:', error)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }

  return NextResponse.json(member)
}
