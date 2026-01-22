import { z } from 'zod'

// Common validations
export const emailSchema = z.string().email('Пожалуйста, введите корректный email адрес')

export const passwordSchema = z
  .string()
  .min(8, 'Пароль должен содержать минимум 8 символов')
  .max(100, 'Пароль должен быть короче 100 символов')

export const displayNameSchema = z
  .string()
  .min(2, 'Имя должно содержать минимум 2 символа')
  .max(100, 'Имя должно быть короче 100 символов')

export const amountSchema = z
  .number()
  .int('Сумма должна быть целым числом')
  .positive('Сумма должна быть больше 0')

export const descriptionSchema = z
  .string()
  .max(500, 'Описание должно быть короче 500 символов')
  .optional()

// Pagination
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export type PaginationParams = z.infer<typeof paginationSchema>

// Paginated response type
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
