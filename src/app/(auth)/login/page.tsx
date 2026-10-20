import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/forms/login-form'

export const metadata = {
  title: 'Вход',
}

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>С возвращением</CardTitle>
        <CardDescription>Войдите в свой аккаунт, чтобы продолжить</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm next={next} />
        <p className="mt-6 text-center text-sm text-gray-600">
          Нет аккаунта?{' '}
          <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
            Зарегистрироваться
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
