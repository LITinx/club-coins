import { z } from 'zod'
import { emailSchema, passwordSchema, displayNameSchema } from './index'

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Введите пароль'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    email: emailSchema,
    displayName: displayNameSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Пожалуйста, подтвердите пароль'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>
