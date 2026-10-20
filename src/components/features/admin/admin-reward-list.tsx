'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Reward } from '@/types/database'
import Link from 'next/link'

interface AdminRewardListProps {
  rewards: Reward[]
}

export function AdminRewardList({ rewards }: AdminRewardListProps) {
  const router = useRouter()
  const [isToggling, setIsToggling] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleToggleActive = async (rewardId: string, currentActive: boolean) => {
    setError(null)
    setIsToggling(rewardId)
    try {
      const response = await fetch(`/api/admin/rewards/${rewardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentActive }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? 'Не удалось обновить награду')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setIsToggling(null)
    }
  }

  if (rewards.length === 0) {
    return (
      <Card variant="bordered">
        <div className="p-8 text-center">
          <p className="text-gray-500">Награды ещё не созданы</p>
          <Link href="/dashboard/admin/rewards/new" className="mt-4 inline-block">
            <Button>Создать первую награду</Button>
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600" role="alert">
          {error}
        </div>
      )}

      {/* Desktop: Table-like list view */}
      <Card variant="bordered" className="hidden sm:block">
        <ul className="divide-y divide-gray-100">
          {rewards.map((reward) => (
            <li key={reward.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <svg
                    className="h-6 w-6 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{reward.name}</p>
                  <p className="text-sm text-gray-500">
                    {reward.coin_cost.toLocaleString()} монет
                    {reward.inventory !== null && ` • ${reward.inventory} в наличии`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    reward.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {reward.is_active ? 'Активна' : 'Неактивна'}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleActive(reward.id, reward.is_active)}
                  disabled={isToggling === reward.id}
                >
                  {reward.is_active ? 'Деактивировать' : 'Активировать'}
                </Button>
                <Link href={`/dashboard/admin/rewards/${reward.id}`}>
                  <Button size="sm" variant="outline">
                    Изменить
                  </Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Mobile: Card-based layout */}
      <div className="space-y-3 sm:hidden">
        {rewards.map((reward) => (
          <Card key={reward.id} variant="bordered" className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100">
                <svg
                  className="h-5 w-5 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 truncate">{reward.name}</p>
                  <span
                    className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      reward.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {reward.is_active ? 'Активна' : 'Неактивна'}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-medium text-primary-600">
                    {reward.coin_cost.toLocaleString()} монет
                  </span>
                  {reward.inventory !== null && (
                    <span>• {reward.inventory} в наличии</span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 min-touch-target"
                onClick={() => handleToggleActive(reward.id, reward.is_active)}
                disabled={isToggling === reward.id}
              >
                {reward.is_active ? 'Деактивировать' : 'Активировать'}
              </Button>
              <Link href={`/dashboard/admin/rewards/${reward.id}`} className="flex-1">
                <Button size="sm" variant="outline" className="w-full min-touch-target">
                  Изменить
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
