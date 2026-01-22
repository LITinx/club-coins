import type { TransactionWithUsers } from '@/types/database'

interface TransactionItemProps {
  transaction: TransactionWithUsers
  currentUserId: string
}

export function TransactionItem({ transaction, currentUserId }: TransactionItemProps) {
  const isReceived =
    transaction.type === 'award' ||
    (transaction.type === 'transfer' && transaction.to_user_id === currentUserId)
  const isRedemption = transaction.type === 'redemption'

  const getIcon = () => {
    if (transaction.type === 'award') {
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      )
    }

    if (transaction.type === 'redemption') {
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
          <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
            />
          </svg>
        </div>
      )
    }

    // Transfer
    if (isReceived) {
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      )
    }

    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
        <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </div>
    )
  }

  const getTitle = () => {
    if (transaction.type === 'award') {
      return 'Reward received'
    }
    if (transaction.type === 'redemption') {
      return `Redeemed: ${transaction.reward?.name ?? 'Reward'}`
    }
    if (isReceived) {
      return `Received from ${transaction.from_user?.display_name ?? 'Unknown'}`
    }
    return `Sent to ${transaction.to_user?.display_name ?? 'Unknown'}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <li className="flex items-center gap-4 p-4">
      {getIcon()}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{getTitle()}</p>
        {transaction.description && (
          <p className="text-sm text-gray-500 truncate">{transaction.description}</p>
        )}
        <p className="text-xs text-gray-400">{formatDate(transaction.created_at)}</p>
      </div>
      <div
        className={`text-right font-semibold ${
          isRedemption || (!isReceived && transaction.type === 'transfer')
            ? 'text-red-600'
            : 'text-green-600'
        }`}
      >
        {isRedemption || (!isReceived && transaction.type === 'transfer') ? '-' : '+'}
        {transaction.amount.toLocaleString()}
      </div>
    </li>
  )
}
