import { z } from 'zod'

export const rewardSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').nullable().optional(),
  coin_cost: z
    .number()
    .int('Cost must be a whole number')
    .positive('Cost must be positive')
    .max(100000, 'Cost cannot exceed 100,000'),
  inventory: z.number().int().min(0).nullable().optional(),
  is_active: z.boolean().default(true),
})

export const rewardUpdateSchema = rewardSchema.partial()

export type RewardInput = z.infer<typeof rewardSchema>
export type RewardUpdateInput = z.infer<typeof rewardUpdateSchema>
