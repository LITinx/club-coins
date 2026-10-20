'use client'

import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

// Native <dialog>: the browser handles Escape, initial focus and the inert background.
// Bottom sheet on phones, centered card from sm up. Portaled to <body> so parent layout
// rules (e.g. space-y-* margins on siblings) can't shift it.
export function Modal({ title, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  return createPortal(
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      // Backdrop clicks land on the <dialog> itself; the content is the inner div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-0 mt-auto max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-black/50 sm:m-auto sm:max-w-md"
    >
      <div className="max-h-[90vh] overflow-auto rounded-t-2xl bg-surface p-4 text-gray-900 shadow-xl safe-area-inset-bottom animate-slide-up sm:rounded-xl sm:p-6 sm:animate-none">
        {/* Mobile drag handle */}
        <div className="mb-3 flex justify-center sm:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>

        <div className="mb-4 flex items-start justify-between">
          <h3 id={titleId} className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 min-touch-target touch-manipulation"
            aria-label="Закрыть"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {children}
      </div>
    </dialog>,
    document.body
  )
}
