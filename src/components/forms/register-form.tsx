'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterInput, string>>>({})

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setFieldErrors({})

    const formData = new FormData(event.currentTarget)
    const data = {
      email: formData.get('email') as string,
      displayName: formData.get('displayName') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    }

    // Validate input
    const result = registerSchema.safeParse(data)
    if (!result.success) {
      const errors: Partial<Record<keyof RegisterInput, string>> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterInput
        errors[field] = issue.message
      })
      setFieldErrors(errors)
      setIsLoading(false)
      return
    }

    // Sign up with Supabase
    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
      options: {
        data: {
          display_name: result.data.displayName,
        },
      },
    })

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setError('Аккаунт с этим email уже существует')
      } else {
        setError(signUpError.message)
      }
      setIsLoading(false)
      return
    }

    // Check if email confirmation is required
    setSuccess(true)
    setIsLoading(false)

    // If no email confirmation required, redirect to dashboard
    setTimeout(() => {
      router.push('/dashboard')
      router.refresh()
    }, 2000)
  }

  if (success) {
    return (
      <div className="rounded-lg bg-green-50 p-4 text-center">
        <p className="font-medium text-green-800">Аккаунт успешно создан!</p>
        <p className="mt-1 text-sm text-green-600">Перенаправление на панель управления...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600" role="alert">
          {error}
        </div>
      )}

      <Input
        label="Отображаемое имя"
        name="displayName"
        type="text"
        placeholder="Иван Иванов"
        autoComplete="name"
        error={fieldErrors.displayName}
        required
      />

      <Input
        label="Электронная почта"
        name="email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={fieldErrors.email}
        required
      />

      <Input
        label="Пароль"
        name="password"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={fieldErrors.password}
        hint="Минимум 8 символов"
        required
      />

      <Input
        label="Подтвердите пароль"
        name="confirmPassword"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={fieldErrors.confirmPassword}
        required
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Создать аккаунт
      </Button>
    </form>
  )
}
