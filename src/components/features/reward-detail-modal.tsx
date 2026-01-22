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

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? 'Failed to redeem reward')
      }

      router.push('/dashboard/rewards/success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Confirm Redemption</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
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

        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 p-8">
            <svg
              className="h-20 w-20 text-primary-500"
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
            <h4 className="text-xl font-bold text-gray-900">{reward.name}</h4>
            {reward.description && (
              <p className="mt-1 text-sm text-gray-500">{reward.description}</p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <span className="text-gray-600">Cost</span>
            <span className="text-xl font-bold text-primary-600">
              {reward.coin_cost.toLocaleString()} coins
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <span className="text-gray-600">Your Balance</span>
            <span className={`text-lg font-semibold ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
              {userBalance.toLocaleString()} coins
            </span>
          </div>

          {canAfford && (
            <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
              <span className="text-green-700">Balance After</span>
              <span className="text-lg font-semibold text-green-700">
                {(userBalance - reward.coin_cost).toLocaleString()} coins
              </span>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 text-black" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleRedeem}
            disabled={!canAfford || !isAvailable || isLoading}
          >
            {isLoading ? 'Processing...' : 'Confirm Redemption'}
          </Button>
        </div>
      </div>
    </div>
  )
}
