import { Card, CardContent } from '@/components/ui/card'

interface BalanceCardProps {
  balance: number
}

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
      <CardContent className="py-8">
        <p className="text-sm font-medium text-primary-100">Your Balance</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-4xl font-bold">{balance.toLocaleString()}</span>
          <span className="text-lg text-primary-100">coins</span>
        </div>
        <div className="mt-4 flex gap-4">
          <a
            href="/dashboard/transfer"
            className="flex items-center gap-1 rounded-lg bg-white/20 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/30"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            Transfer
          </a>
          <a
            href="/dashboard/rewards"
            className="flex items-center gap-1 rounded-lg bg-white/20 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/30"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Redeem
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
