import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary-100">
          <span className="text-5xl font-bold text-primary-600">404</span>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Страница не найдена</h1>
        <p className="mb-6 text-gray-500">
          К сожалению, запрашиваемая страница не существует или была перемещена.
        </p>
        <Link href="/dashboard">
          <Button>Перейти на главную</Button>
        </Link>
      </div>
    </div>
  )
}
