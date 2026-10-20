'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { Reward } from '@/types/database'

interface RewardCardProps {
  reward: Reward
  userBalance: number
  onRedeem: (reward: Reward) => void
}

export function RewardCard({ reward, userBalance, onRedeem }: RewardCardProps) {
  const canAfford = userBalance >= reward.coin_cost
  const isAvailable = reward.inventory === null || reward.inventory > 0

  return (
    <Card variant="bordered" className="flex flex-col">
      <CardContent className="flex flex-1 flex-col p-4">
        <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-primary-100 to-primary-200">
          <svg
            className="h-16 w-16 text-primary-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
            />
          </svg>
        </div>

        <h3 className="mb-1 font-semibold text-gray-900 truncate" title={reward.name}>{reward.name}</h3>
        {reward.description && (
          <p className="mb-3 flex-1 text-sm text-gray-500 line-clamp-2">{reward.description}</p>
        )}

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary-600">
              {reward.coin_cost.toLocaleString()} монет
            </span>
            {!isAvailable && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                Нет в наличии
              </span>
            )}
            {isAvailable && reward.inventory !== null && (
              <span className="text-xs text-gray-500">
                Осталось: {reward.inventory}
              </span>
            )}
          </div>

          {isAvailable && !canAfford ? (
            <div className="space-y-2 py-1">
              <Progress
                value={userBalance}
                max={reward.coin_cost}
                label={`Прогресс до награды «${reward.name}»`}
              />
              <p className="text-center text-sm text-gray-600">
                Не хватает монет: {(reward.coin_cost - userBalance).toLocaleString('ru-RU')}
              </p>
            </div>
          ) : (
            <Button
              className="w-full min-touch-target"
              disabled={!isAvailable}
              onClick={() => onRedeem(reward)}
            >
              {isAvailable ? 'Обменять' : 'Нет в наличии'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
