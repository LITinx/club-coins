'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserSearch } from '@/components/features/user-search'

interface Member {
  id: string
  display_name: string
  email: string
}

interface AwardCoinsFormProps {
  preselectedUser?: Member | null
}

export function AwardCoinsForm({ preselectedUser }: AwardCoinsFormProps) {
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState<Member | null>(preselectedUser ?? null)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastAward, setLastAward] = useState<{ name: string; amount: number } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/members/${selectedUser.id}/award`, {
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
        throw new Error(data.error ?? 'Не удалось начислить монеты')
      }

      setLastAward({ name: selectedUser.display_name, amount: parseInt(amount, 10) })
      setAmount('')
      setDescription('')
      setSelectedUser(null)

      // Refresh the page data
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  if (lastAward) {
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
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Монеты начислены!</h3>
          <p className="mb-4 text-gray-500">
            {lastAward.name} — монет: {lastAward.amount.toLocaleString('ru-RU')}. Участник получил
            уведомление.
          </p>
          <Button onClick={() => setLastAward(null)}>Начислить ещё</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>Начислить монеты участнику</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="member" className="mb-1.5 block text-sm font-medium text-gray-700">
              Участник
            </label>
            <UserSearch id="member" selectedUser={selectedUser} onSelect={setSelectedUser} />
          </div>

          <Input
            label="Сумма"
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min="1"
            max="10000"
            hint="До 10 000 монет за раз"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Введите количество монет"
            required
          />

          <Input
            label="Описание (необязательно)"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="например, Бонус за посещение, Участие в мероприятии"
          />

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600" role="alert">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={!selectedUser || isLoading}>
            {isLoading ? 'Начисление...' : 'Начислить монеты'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
