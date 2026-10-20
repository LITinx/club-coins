'use client'

import { useEffect, useState } from 'react'
import { LogoutButton } from './logout-button'

interface MobileMenuProps {
  displayName: string
  balance: number
}

// Profile menu for phones; page navigation lives in the bottom MobileNav
export function MobileMenu({ displayName, balance }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false)
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  return (
    <div className="relative sm:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="round-btn h-11 w-11"
        aria-label="Профиль"
        aria-expanded={isOpen}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-3xl border border-gray-200 bg-surface py-2 shadow-lg animate-slide-up">
            <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-600">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900">{displayName}</p>
                <p className="text-sm text-primary-600">{balance.toLocaleString('ru-RU')} монет</p>
              </div>
            </div>

            <div className="px-4 py-2">
              <LogoutButton className="w-full justify-center" />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
