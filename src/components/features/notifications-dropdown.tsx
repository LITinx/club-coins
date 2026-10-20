'use client'

import { useState, useEffect, useRef } from 'react'
import type { Notification } from '@/types/database'

interface NotificationsDropdownProps {
  onClose: () => void
  onMarkAsRead: () => void
}

export function NotificationsDropdown({ onClose, onMarkAsRead }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications')
        if (response.ok) {
          const data = await response.json()
          setNotifications(data)
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' })
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      )
      onMarkAsRead()
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Только что'
    if (diffMins < 60) return `${diffMins} мин назад`
    if (diffHours < 24) return `${diffHours} ч назад`
    if (diffDays < 7) return `${diffDays} дн назад`
    return date.toLocaleDateString('ru-RU')
  }

  return (
    <>
      {/* Mobile: Full-screen overlay */}
      <div className="fixed inset-0 z-40 bg-black/20 sm:hidden" onClick={onClose} />

      <div
        ref={dropdownRef}
        className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] rounded-t-2xl border-t border-gray-200 bg-surface shadow-lg safe-area-inset-bottom animate-slide-up sm:absolute sm:inset-auto sm:right-0 sm:top-12 sm:w-80 sm:rounded-lg sm:border sm:animate-none"
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center py-2 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>

        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h3 className="font-semibold text-gray-900">Уведомления</h3>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 sm:hidden min-touch-target touch-manipulation"
            aria-label="Закрыть"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto scroll-smooth-touch sm:max-h-96">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Загрузка...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Нет уведомлений</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`cursor-pointer px-4 py-4 hover:bg-gray-50 active:bg-gray-100 min-touch-target touch-manipulation sm:py-3 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <p className="text-sm text-gray-900">{notification.message}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatDate(notification.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
