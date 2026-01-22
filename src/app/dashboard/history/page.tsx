import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TransactionList } from '@/components/features/transaction-list'
import type { TransactionWithUsers } from '@/types/database'

export const metadata = {
  title: 'История транзакций',
}

export default async function HistoryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get all transactions for this user
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">История транзакций</h1>
        <p className="text-gray-600">Просмотрите все ваши операции с монетами</p>
      </div>

      <TransactionList
        transactions={(transactions ?? []) as TransactionWithUsers[]}
        currentUserId={user.id}
        showEmpty
      />
    </div>
  )
}
