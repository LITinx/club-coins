import type { TransactionWithUsers } from '@/types/database'

interface TransactionItemProps {
  transaction: TransactionWithUsers
  currentUserId: string
}

const iconCircle =
  'flex h-10 w-10 items-center justify-center rounded-full bg-surface shadow-soft ring-1 ring-gray-200/70 dark:bg-gray-100 dark:shadow-none dark:ring-primary-500/10'

export function TransactionItem({ transaction, currentUserId }: TransactionItemProps) {
  const isReceived =
    transaction.type === 'award' ||
    (transaction.type === 'transfer' && transaction.to_user_id === currentUserId)
  const isRedemption = transaction.type === 'redemption'

  const getIcon = () => {
    if (transaction.type === 'award') {
      return (
        <div className={iconCircle}>
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
        <div className={iconCircle}>
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
        <div className={iconCircle}>
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
      <div className={iconCircle}>
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
      return 'Награда получена'
    }
    if (transaction.type === 'redemption') {
      return `Обменяно: ${transaction.reward?.name ?? 'Награда'}`
    }
    if (isReceived) {
      return `Получено от ${transaction.from_user?.display_name ?? 'Неизвестно'}`
    }
    return `Отправлено ${transaction.to_user?.display_name ?? 'Неизвестно'}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      month: 'short',
      day: 'numeric',
    })
  }

  const isNegative = isRedemption || (!isReceived && transaction.type === 'transfer')

  return (
    <li className="flex items-center gap-3 rounded-2xl p-3 transition hover:bg-surface sm:gap-4 dark:hover:bg-gray-100/60">
      {/* Icon - smaller on mobile */}
      <div className="flex-shrink-0 [&>div]:h-8 [&>div]:w-8 sm:[&>div]:h-10 sm:[&>div]:w-10 [&_svg]:h-4 [&_svg]:w-4 sm:[&_svg]:h-5 sm:[&_svg]:w-5">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-900 truncate text-sm sm:text-base">{getTitle()}</p>
            {/* Description - hidden on very small screens, shown as tooltip or on tap */}
            {transaction.description && (
              <p className="hidden text-sm text-gray-500 truncate xs:block sm:text-sm">
                {transaction.description}
              </p>
            )}
          </div>
          {/* Amount */}
          <div
            className={`flex-shrink-0 text-right font-medium tabular-nums text-sm sm:text-base ${
              isNegative ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
            }`}
          >
            {isNegative ? '-' : '+'}
            {transaction.amount.toLocaleString()}
          </div>
        </div>
        {/* Date - mobile shows short version */}
        <p className="text-xs text-gray-400 mt-0.5">
          <span className="sm:hidden">{formatDateShort(transaction.created_at)}</span>
          <span className="hidden sm:inline">{formatDate(transaction.created_at)}</span>
        </p>
        {/* Description on mobile - show below if exists and screen is very small */}
        {transaction.description && (
          <p className="text-xs text-gray-500 truncate xs:hidden mt-0.5">
            {transaction.description}
          </p>
        )}
      </div>
    </li>
  )
}
