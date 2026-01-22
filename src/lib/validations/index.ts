import { z } from 'zod'

// Common validations
export const emailSchema = z.string().email('Please enter a valid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')

export const displayNameSchema = z
  .string()
  .min(2, 'Display name must be at least 2 characters')
  .max(100, 'Display name must be less than 100 characters')

export const amountSchema = z
  .number()
  .int('Amount must be a whole number')
  .positive('Amount must be greater than 0')

export const descriptionSchema = z
  .string()
  .max(500, 'Description must be less than 500 characters')
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
