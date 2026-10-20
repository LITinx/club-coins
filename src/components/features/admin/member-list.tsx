'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useToast } from '@/components/ui/toast'
import type { User, UserRole, UserStatus } from '@/types/database'
import Link from 'next/link'

const roleLabels: Record<UserRole, string> = { admin: 'Админ', student: 'Студент' }
const statusLabels: Record<UserStatus, string> = { active: 'Активен', inactive: 'Неактивен' }

interface MemberListProps {
  members: User[]
  currentUserId: string
}

interface PendingAction {
  member: User
  kind: 'role' | 'status' | 'delete'
}

function dialogCopy({ member, kind }: PendingAction) {
  const name = <strong className="text-gray-900">{member.display_name}</strong>
  if (kind === 'delete') {
    return {
      title: 'Удалить участника?',
      message: <>{name} будет удалён без возможности восстановления.</>,
      confirmLabel: 'Удалить',
      variant: 'danger' as const,
    }
  }
  if (kind === 'status') {
    return member.status === 'active'
      ? {
          title: 'Деактивировать участника?',
          message: <>{name} не сможет переводить и обменивать монеты.</>,
          confirmLabel: 'Деактивировать',
          variant: 'danger' as const,
        }
      : {
          title: 'Активировать участника?',
          message: <>{name} снова сможет переводить и обменивать монеты.</>,
          confirmLabel: 'Активировать',
          variant: 'primary' as const,
        }
  }
  if (member.role === 'admin') {
    return {
      title: 'Снять права администратора?',
      message: <>{name} потеряет доступ к админ-панели.</>,
      confirmLabel: 'Снять права',
      variant: 'danger' as const,
    }
  }
  return {
    title: 'Сделать администратором?',
    message: <>{name} получит доступ к админ-панели и сможет начислять монеты.</>,
    confirmLabel: 'Сделать админом',
    variant: 'primary' as const,
  }
}

function sendAction({ member, kind }: PendingAction) {
  if (kind === 'delete') {
    return fetch(`/api/admin/members/${member.id}`, { method: 'DELETE' })
  }
  const [path, body] =
    kind === 'role'
      ? ['role', { role: member.role === 'admin' ? 'student' : 'admin' }]
      : ['status', { status: member.status === 'active' ? 'inactive' : 'active' }]
  return fetch(`/api/admin/members/${member.id}/${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function MemberList({ members, currentUserId }: MemberListProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [query, setQuery] = useState('')
  const [pending, setPending] = useState<PendingAction | null>(null)
  const [isWorking, setIsWorking] = useState(false)

  const q = query.trim().toLowerCase()
  const visible = members.filter(
    (m) => !q || m.display_name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
  )

  const confirmPending = async () => {
    if (!pending) return
    const { member, kind } = pending
    setIsWorking(true)
    try {
      const response = await sendAction(pending)

      if (response.ok) {
        const done = {
          delete: `${member.display_name} удалён`,
          role: `Роль ${member.display_name} изменена`,
          status: `Статус ${member.display_name} изменён`,
        }
        addToast(done[kind], 'success')
        router.refresh()
      } else {
        const data = await response.json().catch(() => null)
        addToast(data?.error ?? 'Не удалось выполнить действие', 'error')
      }
    } catch (error) {
      console.error('Member action failed:', error)
      addToast('Не удалось выполнить действие', 'error')
    } finally {
      setIsWorking(false)
      setPending(null)
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

  const awardLink = (member: User, className = '') =>
    member.status === 'active' && (
      <Link href={`/dashboard/admin/award?userId=${member.id}`} className={className}>
        <Button size="sm" variant="outline" className="w-full min-touch-target sm:min-h-0">
          Начислить
        </Button>
      </Link>
    )

  const statusButton = (member: User, className = '') => (
    <Button
      size="sm"
      variant="ghost"
      className={`min-touch-target sm:min-h-0 ${className}`}
      onClick={() => setPending({ member, kind: 'status' })}
    >
      {member.status === 'active' ? 'Деактивировать' : 'Активировать'}
    </Button>
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
                  {awardLink(member)}
                  {member.id !== currentUserId && (
                    <>
                      {statusButton(member)}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPending({ member, kind: 'role' })}
                      >
                        {member.role === 'admin' ? 'Снять админа' : 'Сделать админом'}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setPending({ member, kind: 'delete' })}
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
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
              <div className="flex gap-2">
                {awardLink(member, 'flex-1')}
                {member.id !== currentUserId && statusButton(member, 'flex-1')}
              </div>
              {member.id !== currentUserId && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 min-touch-target"
                    onClick={() => setPending({ member, kind: 'role' })}
                  >
                    {member.role === 'admin' ? 'Снять админа' : 'Сделать админом'}
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    className="flex-1 min-touch-target"
                    onClick={() => setPending({ member, kind: 'delete' })}
                  >
                    Удалить
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {pending && (
        <ConfirmDialog
          {...dialogCopy(pending)}
          isLoading={isWorking}
          onConfirm={confirmPending}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  )
}
