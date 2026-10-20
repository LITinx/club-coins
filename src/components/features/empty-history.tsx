import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

export function EmptyHistory() {
  return (
    <Card variant="bordered">
      <CardContent className="py-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">Пока нет транзакций</h3>
        <p className="text-gray-500 text-balance">
          Монеты начисляет администратор клуба за участие в активностях, достижения и помощь
          клубу. Их также может перевести вам другой участник.
        </p>
        <Link href="/dashboard/rewards" className="round-btn mx-auto mt-6 h-11 w-fit px-5 text-sm font-medium">
          Посмотреть награды
        </Link>
      </CardContent>
    </Card>
  )
}
