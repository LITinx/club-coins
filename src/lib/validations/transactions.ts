import { z } from 'zod'

export const awardSchema = z.object({
  amount: z
    .number()
    .int('Amount must be a whole number')
    .positive('Amount must be positive')
    .max(10000, 'Amount cannot exceed 10,000'),
  description: z.string().max(255, 'Description too long').optional(),
})

export const transferSchema = z.object({
  toUserId: z.string().uuid('Invalid recipient'),
  amount: z
    .number()
    .int('Amount must be a whole number')
    .positive('Amount must be positive'),
  description: z.string().max(255, 'Description too long').optional(),
})

export type AwardInput = z.infer<typeof awardSchema>
export type TransferInput = z.infer<typeof transferSchema>
