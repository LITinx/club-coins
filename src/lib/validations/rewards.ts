import { z } from 'zod'

export const rewardSchema = z.object({
  name: z.string().min(1, 'Введите название').max(100, 'Название должно быть короче 100 символов'),
  description: z.string().max(500, 'Описание должно быть короче 500 символов').nullable().optional(),
  coin_cost: z
    .number()
    .int('Стоимость должна быть целым числом')
    .positive('Стоимость должна быть больше 0')
    .max(100000, 'Стоимость не может превышать 100 000'),
  inventory: z.number().int('Количество должно быть целым числом').min(0, 'Количество не может быть отрицательным').nullable().optional(),
  is_active: z.boolean().default(true),
})

export const rewardUpdateSchema = rewardSchema.partial()

export type RewardInput = z.infer<typeof rewardSchema>
export type RewardUpdateInput = z.infer<typeof rewardUpdateSchema>
