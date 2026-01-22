'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Reward } from '@/types/database'

interface RewardFormProps {
  reward?: Reward
}

export function RewardForm({ reward }: RewardFormProps) {
  const router = useRouter()
  const isEditing = !!reward

  const [name, setName] = useState(reward?.name ?? '')
  const [description, setDescription] = useState(reward?.description ?? '')
  const [coinCost, setCoinCost] = useState(reward?.coin_cost?.toString() ?? '')
  const [inventory, setInventory] = useState(reward?.inventory?.toString() ?? '')
  const [isActive, setIsActive] = useState(reward?.is_active ?? true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const payload = {
        name,
        description: description || null,
        coin_cost: parseInt(coinCost, 10),
        inventory: inventory ? parseInt(inventory, 10) : null,
        is_active: isActive,
      }

      const url = isEditing ? `/api/admin/rewards/${reward.id}` : '/api/admin/rewards'
      const method = isEditing ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? 'Не удалось сохранить награду')
      }

      router.push('/dashboard/admin/rewards')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>{isEditing ? 'Редактировать награду' : 'Новая награда'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Название"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="например, Бесплатный кофе"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание (необязательно)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите награду..."
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <Input
            label="Стоимость в монетах"
            type="number"
            min="1"
            value={coinCost}
            onChange={(e) => setCoinCost(e.target.value)}
            placeholder="Сколько монет нужно для обмена"
            required
          />

          <Input
            label="Количество (необязательно)"
            type="number"
            min="0"
            value={inventory}
            onChange={(e) => setInventory(e.target.value)}
            placeholder="Оставьте пустым для неограниченного"
            hint="Установите число для ограничения доступности"
          />

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Активна (видна в каталоге)
            </label>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Сохранение...' : isEditing ? 'Обновить награду' : 'Создать награду'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
