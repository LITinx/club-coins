/* eslint-disable @typescript-eslint/no-explicit-any */

interface AdminCheckResult {
  error?: string
  status: number
  userId?: string
  role?: string
}

export async function checkAdminRole(
  supabase: any,
  allowedRoles: string[] = ['admin']
): Promise<AdminCheckResult> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Требуется вход', status: 401 }
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const typedProfile = profile as { role: string } | null

  if (!typedProfile || !allowedRoles.includes(typedProfile.role)) {
    return { error: 'Доступ только для администраторов', status: 403 }
  }

  return { status: 200, userId: user.id, role: typedProfile.role }
}
