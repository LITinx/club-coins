import Link from 'next/link'

interface BalanceCardProps {
  balance: number
}

const actions = [
  { href: '/dashboard/transfer', label: 'Перевести', icon: 'M7 17 17 7M8 7h9v9' },
  { href: '/dashboard/history', label: 'История', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  {
    href: '/dashboard/rewards',
    label: 'Обменять',
    icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
    primary: true,
  },
]

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <section className="flex flex-col items-center pt-6 text-center sm:pt-10">
      <p className="text-base text-gray-500">Ваш баланс</p>
      <div className="mt-1 flex items-start gap-2">
        <span className="text-7xl font-light leading-tight tracking-tighter text-gray-900 tabular-nums sm:text-8xl dark:bg-gradient-to-b dark:from-gray-900 dark:to-primary-500 dark:bg-clip-text dark:text-transparent dark:drop-shadow-[0_0_28px_rgb(var(--primary-500)/0.45)]">
          {balance.toLocaleString('ru-RU')}
        </span>
        <span className="mt-3 text-sm font-medium text-gray-500">монет</span>
      </div>

      <div className="mt-8 grid w-full max-w-sm grid-cols-3 gap-4 sm:mt-10">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group flex flex-col items-center gap-2 text-sm text-gray-600 touch-manipulation"
          >
            <span
              className={`aspect-square w-full max-w-[5.5rem] ${
                action.primary
                  ? 'flex items-center justify-center rounded-full bg-primary-500 text-gray-900 shadow-soft transition group-hover:bg-primary-400 group-active:scale-95 dark:text-on-primary dark:shadow-glow dark:group-hover:bg-primary-600'
                  : 'round-btn group-hover:bg-gray-100'
              }`}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={action.icon} />
              </svg>
            </span>
            {action.label}
          </Link>
        ))}
      </div>
    </section>
  )
}
