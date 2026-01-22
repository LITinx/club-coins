import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AdminRewardList } from '@/components/features/admin/admin-reward-list'
import type { Reward } from '@/types/database'

export const metadata = {
  title: 'Manage Rewards',
}

export default async function AdminRewardsPage() {
  const supabase = await createClient()

  const { data: rewards } = await supabase
    .from('rewards')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Rewards</h1>
          <p className="text-gray-600">Create and manage reward catalog items</p>
        </div>
        <Link href="/dashboard/admin/rewards/new">
          <Button>Add Reward</Button>
        </Link>
      </div>

      <AdminRewardList rewards={(rewards ?? []) as Reward[]} />
    </div>
  )
}
