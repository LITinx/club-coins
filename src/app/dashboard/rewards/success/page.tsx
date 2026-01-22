import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = {
  title: 'Обмен успешен',
}

export default function RewardSuccessPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Card variant="bordered" className="max-w-md">
        <CardContent className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Обмен успешен!</h1>
          <p className="mb-6 text-gray-500">
            Ваша награда обменяна. Обратитесь к администратору клуба, чтобы получить награду.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/dashboard/rewards">
              <Button variant="outline">Смотреть другие награды</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Вернуться на главную</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
