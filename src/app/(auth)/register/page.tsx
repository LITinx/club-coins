import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RegisterForm } from '@/components/forms/register-form'

export const metadata = {
  title: 'Регистрация',
}

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Создать аккаунт</CardTitle>
        <CardDescription>Присоединяйтесь к клубу и начните зарабатывать монеты</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-gray-600">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Войти
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
