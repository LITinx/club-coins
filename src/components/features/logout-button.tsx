'use client'

import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/supabase/auth'

interface LogoutButtonProps {
  className?: string
}

export function LogoutButton({ className }: LogoutButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signOut()}
      className={className}
      aria-label="Выйти"
      title="Выйти"
    >
      <svg className="mr-2 h-5 w-5 sm:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      <span className="sm:hidden">Выйти</span>
    </Button>
  )
}
