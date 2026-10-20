'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { User, UserRole, UserStatus } from '@/types/database'
import Link from 'next/link'

const roleLabels: Record<UserRole, string> = { admin: 'Админ', student: 'Студент' }
const statusLabels: Record<UserStatus, string> = { active: 'Активен', inactive: 'Неактивен' }

interface MemberListProps {
  members: User[]
  currentUserId: string
}

export function MemberList({ members, currentUserId }: MemberListProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const q = query.trim().toLowerCase()
  const visible = members.filter(
    (m) => !q || m.display_name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
  )

  const handleToggleStatus = async (member: User) => {
    const status = member.status === 'active' ? 'inactive' : 'active'
    if (
      status === 'inactive' &&
      !window.confirm(`Деактивировать ${member.display_name}? Участник не сможет переводить и обменивать монеты.`)
    ) {
      return
    }

    setError(null)
    setTogglingId(member.id)

    try {
      const response = await fetch(`/api/admin/members/${member.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? 'Не удалось обновить статус')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setTogglingId(null)
    }
  }

  if (members.length === 0) {
    return (
      <Card variant="bordered">
        <div className="p-8 text-center">
          <p className="text-gray-500">Участники не найдены</p>
        </div>
      </Card>
    )
  }

  const actions = (member: User, className = '') => (
    <>
      {member.status === 'active' && (
        <Link href={`/dashboard/admin/award?userId=${member.id}`} className={className}>
          <Button size="sm" variant="outline" className="w-full min-touch-target">
            Начислить
          </Button>
        </Link>
      )}
      {member.id !== currentUserId && (
        <Button
          size="sm"
          variant="ghost"
          className={`min-touch-target ${className}`}
          onClick={() => handleToggleStatus(member)}
          isLoading={togglingId === member.id}
        >
          {member.status === 'active' ? 'Деактивировать' : 'Активировать'}
        </Button>
      )}
    </>
  )

  return (
    <div className="space-y-4">
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск по имени или email"
        aria-label="Поиск участников"
      />

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600" role="alert">
          {error}
        </div>
      )}

      {visible.length === 0 && (
        <Card variant="bordered">
          <p className="p-8 text-center text-gray-500">Ничего не найдено</p>
        </Card>
      )}

      {/* Desktop: Table-like list view */}
      {visible.length > 0 && (
        <Card variant="bordered" className="hidden sm:block">
          <ul className="divide-y divide-gray-100">
            {visible.map((member) => (
              <li key={member.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-semibold">
                    {member.display_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.display_name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Баланс</p>
                    <p className="font-semibold text-gray-900">{member.balance.toLocaleString()}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      member.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {statusLabels[member.status]}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      member.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {roleLabels[member.role]}
                  </span>
                  {actions(member)}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Mobile: Card-based layout */}
      <div className="space-y-3 sm:hidden">
        {visible.map((member) => (
          <Card key={member.id} variant="bordered" className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-semibold text-lg">
                {member.display_name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 truncate">{member.display_name}</p>
                  <span
                    className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      member.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {roleLabels[member.role]}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">{member.email}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-500">Баланс:</span>
                    <span className="font-semibold text-primary-600">
                      {member.balance.toLocaleString()}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      member.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {statusLabels[member.status]}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
              {actions(member, 'flex-1')}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
