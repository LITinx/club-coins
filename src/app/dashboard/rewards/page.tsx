import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { RewardGrid } from '@/components/features/reward-grid'
import type { Reward } from '@/types/database'

export const metadata = {
  title: 'Каталог наград',
}

export default async function RewardsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's balance
  const { data: profile } = await supabase
    .from('users')
    .select('balance')
    .eq('id', user.id)
    .single()

  const typedProfile = profile as { balance: number } | null

  // Get active rewards
  const { data: rewards } = await supabase
    .from('rewards')
    .select('*')
    .eq('is_active', true)
    .order('coin_cost', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Каталог наград</h1>
        <p className="text-gray-600">
          Ваш баланс: <span className="font-semibold text-primary-600">{typedProfile?.balance ?? 0}</span> монет
        </p>
      </div>

      <RewardGrid rewards={(rewards ?? []) as Reward[]} userBalance={typedProfile?.balance ?? 0} />
    </div>
  )
}
