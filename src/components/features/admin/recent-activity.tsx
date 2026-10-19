import { Card } from '@/components/ui/card'
import type { TransactionType, TransactionWithUsers } from '@/types/database'

const typeLabels: Record<TransactionType, string> = {
  award: 'Начисление',
  transfer: 'Перевод',
  redemption: 'Обмен',
}

interface RecentActivityListProps {
  transactions: TransactionWithUsers[]
}

export function RecentActivityList({ transactions }: RecentActivityListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const getActivityDescription = (tx: TransactionWithUsers) => {
    switch (tx.type) {
      case 'award':
        return `${tx.from_user?.display_name ?? 'Админ'} начислил ${tx.amount} монет ${tx.to_user?.display_name ?? 'Неизвестно'}`
      case 'transfer':
        return `${tx.from_user?.display_name ?? 'Неизвестно'} отправил ${tx.amount} монет ${tx.to_user?.display_name ?? 'Неизвестно'}`
      case 'redemption':
        return `${tx.from_user?.display_name ?? 'Неизвестно'} обменял ${tx.reward?.name ?? 'награду'} за ${tx.amount} монет`
      default:
        return `Транзакция на ${tx.amount} монет`
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
          <p className="text-gray-500">Нет недавней активности</p>
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
                {typeLabels[tx.type]}
              </span>
              <div>
                <p className="text-sm text-gray-900">{getActivityDescription(tx)}</p>
                <p className="text-xs text-gray-500">{formatDate(tx.created_at)}</p>
              </div>
            </div>
            <span className="font-semibold text-gray-900">
              {tx.amount.toLocaleString()} монет
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
