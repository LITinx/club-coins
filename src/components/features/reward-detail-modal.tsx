'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { Reward } from '@/types/database'

interface RewardDetailModalProps {
  reward: Reward
  userBalance: number
  onClose: () => void
}

export function RewardDetailModal({ reward, userBalance, onClose }: RewardDetailModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canAfford = userBalance >= reward.coin_cost
  const isAvailable = reward.inventory === null || reward.inventory > 0

  const handleRedeem = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch(`/api/rewards/${reward.id}/redeem`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Не удалось обменять награду')
      }

      router.push(`/dashboard/rewards/success?id=${data.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:px-4">
      {/* Full-screen sheet on mobile, centered modal on desktop */}
      <div className="w-full max-h-[90vh] overflow-auto rounded-t-2xl bg-surface p-4 shadow-xl safe-area-inset-bottom animate-slide-up sm:max-w-md sm:rounded-xl sm:p-6 sm:animate-none">
        {/* Mobile drag handle */}
        <div className="mb-3 flex justify-center sm:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>

        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Подтвердите обмен</h3>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 min-touch-target touch-manipulation"
            aria-label="Закрыть"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 p-6 sm:p-8">
            <svg
              className="h-16 w-16 text-primary-500 sm:h-20 sm:w-20"
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

          <div className="text-center">
            <h4 className="text-lg font-bold text-gray-900 sm:text-xl">{reward.name}</h4>
            {reward.description && (
              <p className="mt-1 text-sm text-gray-500">{reward.description}</p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 sm:p-4">
            <span className="text-gray-600">Стоимость</span>
            <span className="text-lg font-bold text-primary-600 sm:text-xl">
              {reward.coin_cost.toLocaleString()} монет
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 sm:p-4">
            <span className="text-gray-600">Ваш баланс</span>
            <span className={`text-base font-semibold sm:text-lg ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
              {userBalance.toLocaleString()} монет
            </span>
          </div>

          {canAfford && (
            <div className="flex items-center justify-between rounded-lg bg-green-50 p-3 sm:p-4">
              <span className="text-green-700">Баланс после</span>
              <span className="text-base font-semibold text-green-700 sm:text-lg">
                {(userBalance - reward.coin_cost).toLocaleString()} монет
              </span>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Button variant="outline" className="flex-1 min-touch-target order-2 sm:order-1" onClick={onClose}>
            Отмена
          </Button>
          <Button
            className="flex-1 min-touch-target order-1 sm:order-2"
            onClick={handleRedeem}
            disabled={!canAfford || !isAvailable || isLoading}
          >
            {isLoading ? 'Обработка...' : 'Подтвердить обмен'}
          </Button>
        </div>
      </div>
    </div>
  )
}
