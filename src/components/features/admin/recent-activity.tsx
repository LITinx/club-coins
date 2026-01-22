import { Card } from '@/components/ui/card'
import type { TransactionWithUsers } from '@/types/database'

interface RecentActivityListProps {
  transactions: TransactionWithUsers[]
}

export function RecentActivityList({ transactions }: RecentActivityListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const getActivityDescription = (tx: TransactionWithUsers) => {
    switch (tx.type) {
      case 'award':
        return `${tx.from_user?.display_name ?? 'Admin'} awarded ${tx.amount} coins to ${tx.to_user?.display_name ?? 'Unknown'}`
      case 'transfer':
        return `${tx.from_user?.display_name ?? 'Unknown'} sent ${tx.amount} coins to ${tx.to_user?.display_name ?? 'Unknown'}`
      case 'redemption':
        return `${tx.from_user?.display_name ?? 'Unknown'} redeemed ${tx.reward?.name ?? 'a reward'} for ${tx.amount} coins`
      default:
        return `Transaction of ${tx.amount} coins`
    }
  }

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'award':
        return 'bg-green-100 text-green-800'
      case 'transfer':
        return 'bg-blue-100 text-blue-800'
      case 'redemption':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (transactions.length === 0) {
    return (
      <Card variant="bordered">
        <div className="p-8 text-center">
          <p className="text-gray-500">No recent activity</p>
        </div>
      </Card>
    )
  }

  return (
    <Card variant="bordered">
      <ul className="divide-y divide-gray-100">
        {transactions.map((tx) => (
          <li key={tx.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${getTypeStyles(tx.type)}`}
              >
                {tx.type}
              </span>
              <div>
                <p className="text-sm text-gray-900">{getActivityDescription(tx)}</p>
                <p className="text-xs text-gray-500">{formatDate(tx.created_at)}</p>
              </div>
            </div>
            <span className="font-semibold text-gray-900">
              {tx.amount.toLocaleString()} coins
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
