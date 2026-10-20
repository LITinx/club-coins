import Link from 'next/link'
import { Progress } from '@/components/ui/progress'

interface NextRewardProps {
  balance: number
  reward: { name: string; coin_cost: number }
}

export function NextReward({ balance, reward }: NextRewardProps) {
  return (
    <Link
      href="/dashboard/rewards"
      className="block rounded-3xl bg-surface p-5 shadow-soft ring-1 ring-gray-200/70 transition hover:bg-gray-100 dark:bg-gray-100/70 dark:shadow-none dark:ring-primary-500/15"
    >
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className="text-gray-500">Следующая награда</span>
        <span className="tabular-nums text-gray-500">
          {balance.toLocaleString('ru-RU')} / {reward.coin_cost.toLocaleString('ru-RU')}
        </span>
      </div>
      <p className="mt-1 truncate font-medium text-gray-900">{reward.name}</p>
      <Progress value={balance} max={reward.coin_cost} label="Прогресс до награды" className="mt-3" />
      <p className="mt-2 text-sm text-gray-600">
        Не хватает монет: {(reward.coin_cost - balance).toLocaleString('ru-RU')}
      </p>
    </Link>
  )
}
