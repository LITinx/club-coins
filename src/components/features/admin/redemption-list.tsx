'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { redemptionCode } from '@/lib/redemption-code'

export interface AdminRedemption {
  id: string
  amount: number
  created_at: string
  fulfilled_at: string | null
  from_user: { display_name: string } | null
  reward: { name: string } | null
}

interface RedemptionListProps {
  pending: AdminRedemption[]
  fulfilled: AdminRedemption[]
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('ru-RU', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

export function RedemptionList({ pending, fulfilled }: RedemptionListProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [fulfillingId, setFulfillingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const q = query.trim().toLowerCase()
  const visible = pending.filter(
    (r) =>
      !q ||
      redemptionCode(r.id).toLowerCase().includes(q) ||
      r.from_user?.display_name.toLowerCase().includes(q)
  )

  const handleFulfill = async (id: string) => {
    setError(null)
    setFulfillingId(id)

    try {
      const response = await fetch(`/api/admin/redemptions/${id}/fulfill`, { method: 'POST' })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? 'Не удалось отметить выдачу')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setFulfillingId(null)
    }
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600" role="alert">
          {error}
        </div>
      )}

      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Ждут выдачи: {pending.length}</h2>
          {pending.length > 0 && (
            <div className="sm:w-64">
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Код или имя"
                aria-label="Поиск по коду или имени"
              />
            </div>
          )}
        </div>

        {visible.length === 0 ? (
          <Card variant="bordered">
            <p className="p-8 text-center text-gray-500">
              {pending.length === 0 ? 'Все награды выданы' : 'Ничего не найдено'}
            </p>
          </Card>
        ) : (
          <Card variant="bordered">
            <ul className="divide-y divide-gray-100">
              {visible.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">{r.reward?.name ?? 'Награда'}</p>
                    <p className="text-sm text-gray-500">
                      {r.from_user?.display_name ?? 'Неизвестно'} · {formatDate(r.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <span className="font-mono text-lg font-semibold tracking-widest text-gray-900">
                      {redemptionCode(r.id)}
                    </span>
                    <Button
                      size="sm"
                      className="min-touch-target"
                      onClick={() => handleFulfill(r.id)}
                      isLoading={fulfillingId === r.id}
                    >
                      Выдано
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>

      {fulfilled.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Недавно выданные</h2>
          <Card variant="bordered">
            <ul className="divide-y divide-gray-100">
              {fulfilled.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">{r.reward?.name ?? 'Награда'}</p>
                    <p className="truncate text-sm text-gray-500">
                      {r.from_user?.display_name ?? 'Неизвестно'} · выдано{' '}
                      {formatDate(r.fulfilled_at ?? r.created_at)}
                    </p>
                  </div>
                  <span className="font-mono text-sm text-gray-500">{redemptionCode(r.id)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}
    </div>
  )
}
