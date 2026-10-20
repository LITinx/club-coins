'use client'

import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'

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
    <Modal title="Подтвердите перевод" onClose={onCancel}>
      <div className="mb-6 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 sm:p-4">
          <span className="text-gray-600">Кому</span>
          <div className="text-right min-w-0 ml-4">
            <p className="font-medium text-gray-900 truncate">{recipient.display_name}</p>
            <p className="text-xs text-gray-500 truncate">{recipient.email}</p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 sm:p-4">
          <span className="text-gray-600">Сумма</span>
          <span className="text-xl font-bold text-primary-600">
            {amount.toLocaleString()} монет
          </span>
        </div>

        {description && (
          <div className="rounded-lg bg-gray-50 p-3 sm:p-4">
            <span className="text-sm text-gray-600">Примечание</span>
            <p className="mt-1 text-gray-900 break-words">{description}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        <Button variant="outline" className="flex-1 min-touch-target order-2 sm:order-1" onClick={onCancel}>
          Отмена
        </Button>
        <Button className="flex-1 min-touch-target order-1 sm:order-2" onClick={onConfirm}>
          Подтвердить перевод
        </Button>
      </div>
    </Modal>
  )
}
