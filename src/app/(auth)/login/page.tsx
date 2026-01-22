import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/forms/login-form'

export const metadata = {
  title: 'Вход',
}

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>С возвращением</CardTitle>
        <CardDescription>Войдите в свой аккаунт, чтобы продолжить</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
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
