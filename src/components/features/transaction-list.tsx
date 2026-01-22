import { Card } from '@/components/ui/card'
import { TransactionItem } from './transaction-item'
import { EmptyHistory } from './empty-history'
import type { TransactionWithUsers } from '@/types/database'

interface TransactionListProps {
  transactions: TransactionWithUsers[]
  currentUserId: string
  showEmpty?: boolean
}

export function TransactionList({
  transactions,
  currentUserId,
  showEmpty = false,
}: TransactionListProps) {
  if (transactions.length === 0 && showEmpty) {
    return <EmptyHistory />
  }

  if (transactions.length === 0) {
    return null
  }

  return (
    <Card variant="bordered">
      <ul className="divide-y divide-gray-100">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            currentUserId={currentUserId}
          />
        ))}
      </ul>
    </Card>
  )
}
