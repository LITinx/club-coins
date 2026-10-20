import { createClient } from '@/lib/supabase/server'
import { MemberList } from '@/components/features/admin/member-list'
import type { User } from '@/types/database'

export const metadata = {
  title: 'Управление участниками',
}

export default async function AdminMembersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: members } = await supabase
    .from('users')
    .select('*')
    .order('display_name', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Участники клуба</h1>
        <p className="text-gray-600">Просмотр и управление всеми участниками клуба</p>
      </div>

      <MemberList members={(members ?? []) as User[]} currentUserId={user?.id ?? ''} />
    </div>
  )
}
