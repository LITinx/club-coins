import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AwardCoinsForm } from '@/components/forms/award-coins-form'

export const metadata = {
  title: 'Начислить монеты',
}

interface AwardPageProps {
  searchParams: Promise<{ userId?: string }>
}

export default async function AdminAwardPage({ searchParams }: AwardPageProps) {
  const { userId } = await searchParams
  const supabase = await createClient()

  // Also served at /dashboard/award for volunteers, outside the admin layout's guard
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()
  const { data: me } = await supabase
    .from('users')
    .select('role')
    .eq('id', currentUser?.id ?? '')
    .single()
  const role = (me as { role: string } | null)?.role
  if (role !== 'admin' && role !== 'volunteer') {
    redirect('/dashboard')
  }

  // Get preselected user if provided
  let preselectedUser = null
  if (userId) {
    const { data: user } = await supabase
      .from('users')
      .select('id, display_name, email')
      .eq('id', userId)
      .single()
    preselectedUser = user
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Начислить монеты</h1>
        <p className="text-gray-600">Награждайте участников клуба монетами</p>
      </div>

      <AwardCoinsForm preselectedUser={preselectedUser} />
    </div>
  )
}
