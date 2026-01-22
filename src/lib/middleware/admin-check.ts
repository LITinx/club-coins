/* eslint-disable @typescript-eslint/no-explicit-any */

interface AdminCheckResult {
  error?: string
  status: number
  userId?: string
}

export async function checkAdminRole(
  supabase: any
): Promise<AdminCheckResult> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized', status: 401 }
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const typedProfile = profile as { role: string } | null

  if (!typedProfile || typedProfile.role !== 'admin') {
    return { error: 'Forbidden: Admin access required', status: 403 }
  }

  return { status: 200, userId: user.id }
}
