'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import type { Notification } from '@/types/database'

interface NotificationsDropdownProps {
  onClose: () => void
  onMarkAsRead: (all: boolean) => void
}

export function NotificationsDropdown({ onClose, onMarkAsRead }: NotificationsDropdownProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' })
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      )
      onMarkAsRead(false)
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', { method: 'POST' })
      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        onMarkAsRead(true)
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  // Every notification is about a transaction, so open the history
  const handleOpen = (notification: Notification) => {
    if (!notification.read) handleMarkAsRead(notification.id)
    onClose()
    router.push('/dashboard/history')
  }

  const hasUnread = notifications.some((n) => !n.read)

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

  // Portaled to <body>: the header's backdrop-blur makes it the containing block for fixed
  // children (which pinned this sheet above the screen on phones), and its stacking context
  // would put the sheet under the floating bottom nav.
  // Bottom sheet on phones; from sm up a dropdown under the right end of the header.
  return createPortal(
    <>
      {/* Closes on any outside click: dimmed on phones, invisible from sm up */}
      <div className="fixed inset-0 z-50 bg-black/30 sm:bg-transparent" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] rounded-t-2xl border-t border-gray-200 bg-surface shadow-lg safe-area-inset-bottom animate-slide-up sm:inset-x-auto sm:bottom-auto sm:right-[max(1rem,calc(50vw-39rem))] sm:top-[5.25rem] sm:w-80 sm:rounded-3xl sm:border sm:animate-none">
        {/* Mobile drag handle */}
        <div className="flex justify-center py-2 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>

        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h3 className="font-semibold text-gray-900">Уведомления</h3>
          <div className="flex items-center gap-1">
            {hasUnread && (
              <button
                onClick={handleMarkAllAsRead}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-primary-700 hover:bg-gray-100 touch-manipulation"
              >
                Прочитать все
              </button>
            )}
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
        </div>

        <div className="max-h-[50vh] overflow-y-auto scroll-smooth-touch sm:max-h-96">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Загрузка...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Нет уведомлений</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => handleOpen(notification)}
                    className={`block w-full px-4 py-4 text-left hover:bg-gray-50 active:bg-gray-100 min-touch-target touch-manipulation sm:py-3 ${
                      !notification.read ? 'bg-primary-50' : ''
                    }`}
                  >
                    <span className="block text-sm text-gray-900">
                      {!notification.read && <span className="sr-only">Новое: </span>}
                      {notification.message}
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      {formatDate(notification.created_at)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>,
    document.body
  )
}
