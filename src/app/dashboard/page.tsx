import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BalanceCard } from '@/components/features/balance-card'
import { TransactionList } from '@/components/features/transaction-list'
import type { User, TransactionWithUsers } from '@/types/database'

export const metadata = {
  title: 'Панель управления',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const typedProfile = profile as User | null

  if (!typedProfile) {
    redirect('/login')
  }

  // Get recent transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select(
      `
      *,
      from_user:users!transactions_from_user_id_fkey(id, display_name),
      to_user:users!transactions_to_user_id_fkey(id, display_name),
      reward:rewards(id, name)
    `
    )
    .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="mx-auto max-w-xl space-y-10">
      <h1 className="sr-only">С возвращением, {typedProfile.display_name}!</h1>

      <BalanceCard balance={typedProfile.balance} />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl text-gray-900">Последняя активность</h2>
          <Link href="/dashboard/history" className="round-btn h-10 px-4 text-sm font-medium">
            Показать все
          </Link>
        </div>
        <TransactionList
          transactions={(transactions ?? []) as TransactionWithUsers[]}
          currentUserId={user.id}
          showEmpty
        />
      </section>
    </div>
  )
}
