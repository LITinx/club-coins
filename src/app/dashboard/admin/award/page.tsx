import { createClient } from '@/lib/supabase/server'
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

  // Get all active members
  const { data: members } = await supabase
    .from('users')
    .select('id, display_name, email')
    .eq('status', 'active')
    .order('display_name', { ascending: true })

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

      <AwardCoinsForm members={members ?? []} preselectedUser={preselectedUser} />
    </div>
  )
}
