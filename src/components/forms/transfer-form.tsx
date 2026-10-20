'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserSearch } from '@/components/features/user-search'
import { TransferConfirmModal } from '@/components/features/transfer-confirm-modal'

interface TransferFormProps {
  currentBalance: number
  currentUserId: string
  preselectedUser?: SelectedUser | null
}

interface SelectedUser {
  id: string
  display_name: string
  email: string
}

export function TransferForm({ currentBalance, currentUserId, preselectedUser }: TransferFormProps) {
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(preselectedUser ?? null)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const amountNum = parseInt(amount, 10) || 0
  const canTransfer = selectedUser && amountNum > 0 && amountNum <= currentBalance

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (canTransfer) {
      setShowConfirm(true)
    }
  }

  const handleConfirm = async () => {
    if (!selectedUser) return

    setError(null)
    setIsLoading(true)
    setShowConfirm(false)

    try {
      const response = await fetch('/api/transactions/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toUserId: selectedUser.id,
          amount: amountNum,
          description: description || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? 'Не удалось перевести монеты')
      }

      setSuccess(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
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
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Перевод выполнен!</h3>
          <p className="mb-4 text-gray-500">
            {amountNum} монет отправлено {selectedUser?.display_name}
          </p>
          <Button
            onClick={() => {
              setSuccess(false)
              setSelectedUser(null)
              setAmount('')
              setDescription('')
            }}
          >
            Сделать ещё перевод
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Отправить монеты</CardTitle>
          <p className="text-sm text-gray-500">
            Ваш баланс: <span className="font-semibold">{currentBalance.toLocaleString()}</span> монет
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Получатель
              </label>
              <UserSearch
                currentUserId={currentUserId}
                selectedUser={selectedUser}
                onSelect={setSelectedUser}
              />
            </div>

            <Input
              label="Сумма"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min="1"
              max={currentBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Введите количество монет"
              error={amountNum > currentBalance ? 'Недостаточно средств' : undefined}
              required
            />

            <Input
              label="Примечание (необязательно)"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="например, Спасибо за помощь!"
            />

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!canTransfer || isLoading}
            >
              {isLoading ? 'Отправка...' : 'Проверить перевод'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {showConfirm && selectedUser && (
        <TransferConfirmModal
          recipient={selectedUser}
          amount={amountNum}
          description={description}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  )
}
