'use client'

import { Button } from '@/components/ui/button'

interface TransferConfirmModalProps {
  recipient: {
    display_name: string
    email: string
  }
  amount: number
  description?: string
  onConfirm: () => void
  onCancel: () => void
}

export function TransferConfirmModal({
  recipient,
  amount,
  description,
  onConfirm,
  onCancel,
}: TransferConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Confirm Transfer</h3>

        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <span className="text-gray-600">To</span>
            <div className="text-right">
              <p className="font-medium text-gray-900">{recipient.display_name}</p>
              <p className="text-xs text-gray-500">{recipient.email}</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <span className="text-gray-600">Amount</span>
            <span className="text-xl font-bold text-primary-600">
              {amount.toLocaleString()} coins
            </span>
          </div>

          {description && (
            <div className="rounded-lg bg-gray-50 p-4">
              <span className="text-sm text-gray-600">Note</span>
              <p className="mt-1 text-gray-900">{description}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={onConfirm}>
            Confirm Transfer
          </Button>
        </div>
      </div>
    </div>
  )
}
