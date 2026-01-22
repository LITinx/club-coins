'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Member {
  id: string
  display_name: string
  email: string
}

interface AwardCoinsFormProps {
  members: Member[]
  preselectedUser?: Member | null
}

export function AwardCoinsForm({ members, preselectedUser }: AwardCoinsFormProps) {
  const router = useRouter()
  const [selectedUserId, setSelectedUserId] = useState(preselectedUser?.id ?? '')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/members/${selectedUserId}/award`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseInt(amount, 10),
          description: description || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? 'Failed to award coins')
      }

      setSuccess(true)
      setAmount('')
      setDescription('')
      setSelectedUserId('')

      // Refresh the page data
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card variant="bordered">
        <CardContent className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Coins Awarded!</h3>
          <p className="mb-4 text-gray-500">The member has been notified.</p>
          <Button onClick={() => setSuccess(false)}>Award More Coins</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>Award Coins to Member</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="member" className="block text-sm font-medium text-gray-700">
              Select Member
            </label>
            <select
              id="member"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              required
            >
              <option value="">Choose a member...</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.display_name} ({member.email})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Amount"
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter coin amount"
            required
          />

          <Input
            label="Description (optional)"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Attendance bonus, Event participation"
          />

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Awarding...' : 'Award Coins'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
