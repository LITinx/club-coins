'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  const [busyId, setBusyId] = useState<string | null>(null)

  const runAction = async (memberId: string, path: string, init: RequestInit) => {
    setBusyId(memberId)
    try {
      const response = await fetch(`/api/admin/members/${memberId}${path}`, init)
      if (response.ok) {
        router.refresh()
      } else {
        const data = await response.json().catch(() => null)
        alert(data?.error ?? 'Не удалось выполнить действие')
      }
    } catch (error) {
      console.error('Member action failed:', error)
    } finally {
      setBusyId(null)
    }
  }

  const handleToggleRole = (member: User) => {
    const role = member.role === 'admin' ? 'student' : 'admin'
    const question =
      role === 'admin'
        ? `Сделать ${member.display_name} администратором?`
        : `Снять права администратора с ${member.display_name}?`
    if (!confirm(question)) return
    runAction(member.id, '/role', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    })
  }

  const handleDelete = (member: User) => {
    if (!confirm(`Удалить ${member.display_name}? Это действие нельзя отменить.`)) return
    runAction(member.id, '', { method: 'DELETE' })
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

  return (
    <>
      {/* Desktop: Table-like list view */}
      <Card variant="bordered" className="hidden sm:block">
        <ul className="divide-y divide-gray-100">
          {members.map((member) => (
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
                <Link href={`/dashboard/admin/award?userId=${member.id}`}>
                  <Button size="sm" variant="outline">
                    Начислить
                  </Button>
                </Link>
                {member.id !== currentUserId && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busyId === member.id}
                      onClick={() => handleToggleRole(member)}
                    >
                      {member.role === 'admin' ? 'Снять админа' : 'Сделать админом'}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={busyId === member.id}
                      onClick={() => handleDelete(member)}
                    >
                      Удалить
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Mobile: Card-based layout */}
      <div className="space-y-3 sm:hidden">
        {members.map((member) => (
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
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
              <Link href={`/dashboard/admin/award?userId=${member.id}`} className="block">
                <Button size="sm" variant="outline" className="w-full min-touch-target">
                  Начислить
                </Button>
              </Link>
              {member.id !== currentUserId && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 min-touch-target"
                    disabled={busyId === member.id}
                    onClick={() => handleToggleRole(member)}
                  >
                    {member.role === 'admin' ? 'Снять админа' : 'Сделать админом'}
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    className="flex-1 min-touch-target"
                    disabled={busyId === member.id}
                    onClick={() => handleDelete(member)}
                  >
                    Удалить
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
