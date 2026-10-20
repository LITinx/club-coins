'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  title: string
  message: ReactNode
  confirmLabel: string
  variant?: 'primary' | 'danger'
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

// Native <dialog> via showModal() gives focus trapping, Escape and an inert page for free.
// Bottom sheet on mobile, centered modal on desktop (same look as TransferConfirmModal).
// Portaled to <body>: inside a space-y-* parent the sibling margin rule beats mt-auto/m-auto
// and pins the dialog to the top of the screen.
export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  variant = 'primary',
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])

  const cancel = () => {
    if (!isLoading) onCancel()
  }

  return createPortal(
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault()
        cancel()
      }}
      // Clicks on the <dialog> element itself (not its content) are backdrop clicks
      onClick={(e) => e.target === ref.current && cancel()}
      className="mb-0 mt-auto w-full max-w-full rounded-t-2xl bg-surface p-0 text-gray-900 shadow-xl backdrop:bg-black/50 animate-slide-up sm:m-auto sm:max-w-md sm:rounded-xl sm:animate-none"
    >
      <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6">
        {/* Mobile drag handle */}
        <div className="mb-4 flex justify-center sm:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>

        <h3 id={titleId} className="mb-2 text-lg font-semibold text-gray-900">
          {title}
        </h3>
        <div className="mb-6 text-gray-600">{message}</div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Button
            variant="outline"
            className="flex-1 min-touch-target order-2 sm:order-1"
            disabled={isLoading}
            onClick={cancel}
          >
            Отмена
          </Button>
          <Button
            variant={variant}
            className="flex-1 min-touch-target order-1 sm:order-2"
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>,
    document.body
  )
}
