'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'

interface LoginFormProps {
  next?: string
}

export function LoginForm({ next }: LoginFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginInput, string>>>({})

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    setFieldErrors({})

    const formData = new FormData(event.currentTarget)
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    // Validate input
    const result = loginSchema.safeParse(data)
    if (!result.success) {
      const errors: Partial<Record<keyof LoginInput, string>> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginInput
        errors[field] = issue.message
      })
      setFieldErrors(errors)
      setIsLoading(false)
      return
    }

    // Sign in with Supabase
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: result.data.email,
      password: result.data.password,
    })

    if (signInError) {
      setError('Неверный email или пароль')
      setIsLoading(false)
      return
    }

    // Only follow in-app dashboard paths, never an external URL
    router.push(next?.startsWith('/dashboard') ? next : '/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600" role="alert">
          {error}
        </div>
      )}

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
        autoComplete="current-password"
        error={fieldErrors.password}
        required
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Войти
      </Button>
    </form>
  )
}
