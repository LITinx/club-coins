'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { User } from '@/types/database'
import Link from 'next/link'

interface MemberListProps {
  members: User[]
}

export function MemberList({ members }: MemberListProps) {
  if (members.length === 0) {
    return (
      <Card variant="bordered">
        <div className="p-8 text-center">
          <p className="text-gray-500">No members found</p>
        </div>
      </Card>
    )
  }

  return (
    <Card variant="bordered">
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
                <p className="text-sm text-gray-500">Balance</p>
                <p className="font-semibold text-gray-900">{member.balance.toLocaleString()}</p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  member.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {member.status}
              </span>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  member.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {member.role}
              </span>
              <Link href={`/dashboard/admin/award?userId=${member.id}`}>
                <Button size="sm" variant="outline">
                  Award Coins
                </Button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
