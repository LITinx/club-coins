'use client'

import { useState, useEffect, useRef } from 'react'

interface User {
  id: string
  display_name: string
  email: string
}

interface UserSearchProps {
  id?: string
  // Excluded from results (e.g. the sender of a transfer)
  currentUserId?: string
  selectedUser: User | null
  onSelect: (user: User | null) => void
}

export function UserSearch({ id, currentUserId, selectedUser, onSelect }: UserSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const searchUsers = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          // Filter out current user
          setResults(data.filter((user: User) => user.id !== currentUserId))
        }
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(searchUsers, 300)
    return () => clearTimeout(debounce)
  }, [query, currentUserId])

  if (selectedUser) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 sm:px-4 sm:py-2.5 min-h-[44px]">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600">
            {selectedUser.display_name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">{selectedUser.display_name}</p>
            <p className="text-xs text-gray-500 truncate">{selectedUser.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 min-touch-target touch-manipulation"
          aria-label="Удалить выбор"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        id={id}
        aria-label={id ? undefined : 'Поиск участника'}
        type="text"
        inputMode="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setShowDropdown(true)
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder="Поиск по имени или email..."
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 min-h-[44px] touch-manipulation sm:px-4 sm:text-sm"
      />

      {showDropdown && (query.length >= 2 || results.length > 0) && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-surface shadow-lg">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">Поиск...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">Пользователи не найдены</div>
          ) : (
            <ul className="max-h-60 overflow-auto scroll-smooth-touch">
              {results.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(user)
                      setQuery('')
                      setShowDropdown(false)
                    }}
                    className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 active:bg-gray-100 min-touch-target touch-manipulation sm:px-4"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600 sm:h-8 sm:w-8">
                      {user.display_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{user.display_name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
