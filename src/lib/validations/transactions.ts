import { z } from 'zod'
import { amountSchema } from './index'

const noteSchema = z.string().max(255, 'Примечание должно быть короче 255 символов').optional()

export const awardSchema = z.object({
  amount: amountSchema.max(10000, 'Сумма не может превышать 10 000'),
  description: noteSchema,
})

export const transferSchema = z.object({
  toUserId: z.string().uuid('Некорректный получатель'),
  amount: amountSchema,
  description: noteSchema,
})

export type AwardInput = z.infer<typeof awardSchema>
export type TransferInput = z.infer<typeof transferSchema>
