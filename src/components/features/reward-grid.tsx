'use client'

import { useState } from 'react'
import { RewardCard } from './reward-card'
import { RewardDetailModal } from './reward-detail-modal'
import type { Reward } from '@/types/database'

interface RewardGridProps {
  rewards: Reward[]
  userBalance: number
}

export function RewardGrid({ rewards, userBalance }: RewardGridProps) {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)

  if (rewards.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
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
              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">No rewards available</h3>
        <p className="text-gray-500">Check back later for exciting rewards!</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            userBalance={userBalance}
            onRedeem={setSelectedReward}
          />
        ))}
      </div>

      {selectedReward && (
        <RewardDetailModal
          reward={selectedReward}
          userBalance={userBalance}
          onClose={() => setSelectedReward(null)}
        />
      )}
    </>
  )
}
