import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { redemptionCode } from '@/lib/redemption-code'

export const metadata = {
  title: 'Обмен успешен',
}

interface RewardSuccessPageProps {
  searchParams: Promise<{ id?: string }>
}

interface Redemption {
  id: string
  reward: { name: string } | null
}

export default async function RewardSuccessPage({ searchParams }: RewardSuccessPageProps) {
  const { id } = await searchParams
  const supabase = await createClient()

  // RLS only returns the student's own transactions
  const { data } = id
    ? await supabase
        .from('transactions')
        .select('id, reward:rewards(name)')
        .eq('id', id)
        .eq('type', 'redemption')
        .maybeSingle()
    : { data: null }
  const redemption = data as Redemption | null

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
          {redemption ? (
            <>
              <p className="text-gray-700">{redemption.reward?.name ?? 'Награда'}</p>
              <div className="mx-auto my-6 w-fit rounded-2xl bg-gray-100 px-8 py-4">
                <p className="text-sm text-gray-500">Код получения</p>
                <p className="font-mono text-3xl font-semibold tracking-widest text-gray-900">
                  {redemptionCode(redemption.id)}
                </p>
              </div>
              <p className="mb-6 text-gray-500">
                Покажите этот код администратору клуба, чтобы получить награду. Код также сохранён в
                истории.
              </p>
            </>
          ) : (
            <p className="mb-6 text-gray-500">
              Ваша награда обменяна. Обратитесь к администратору клуба, чтобы получить награду.
            </p>
          )}
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
