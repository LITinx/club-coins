import { createClient } from '@/lib/supabase/server'
import { StatsGrid } from '@/components/features/admin/stats-grid'
import { RecentActivityList } from '@/components/features/admin/recent-activity'
import type { TransactionWithUsers } from '@/types/database'

export const metadata = {
  title: 'Статистика клуба',
}

export default async function AdminStatsPage() {
  const supabase = await createClient()

  // Get member stats
  const { count: totalMembers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { count: activeMembers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  // Get coin stats
  const { data: coinStats } = await supabase
    .from('users')
    .select('balance')

  const totalCoinsInCirculation = (coinStats as { balance: number }[] | null)?.reduce((sum, user) => sum + user.balance, 0) ?? 0

  // Get transaction stats
  const { data: awardStats } = await supabase
    .from('transactions')
    .select('amount')
    .eq('type', 'award')

  const totalCoinsAwarded = (awardStats as { amount: number }[] | null)?.reduce((sum, tx) => sum + tx.amount, 0) ?? 0

  const { data: redemptionStats } = await supabase
    .from('transactions')
    .select('amount')
    .eq('type', 'redemption')

  const totalCoinsRedeemed = (redemptionStats as { amount: number }[] | null)?.reduce((sum, tx) => sum + tx.amount, 0) ?? 0

  // Get recent transactions
  const { data: recentTransactions } = await supabase
    .from('transactions')
    .select(`
      *,
      from_user:users!transactions_from_user_id_fkey(id, display_name),
      to_user:users!transactions_to_user_id_fkey(id, display_name),
      reward:rewards(id, name)
    `)
    .order('created_at', { ascending: false })
    .limit(10)

  const stats = {
    totalMembers: totalMembers ?? 0,
    activeMembers: activeMembers ?? 0,
    totalCoinsInCirculation,
    totalCoinsAwarded,
    totalCoinsRedeemed,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Статистика клуба</h1>
        <p className="text-gray-600">Обзор активности монет клуба</p>
      </div>

      <StatsGrid stats={stats} />

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Последняя активность</h2>
        <RecentActivityList transactions={(recentTransactions ?? []) as TransactionWithUsers[]} />
      </div>
    </div>
  )
}
