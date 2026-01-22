import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { RewardForm } from '@/components/forms/reward-form'

export const metadata = {
  title: 'Редактировать награду',
}

interface RewardEditPageProps {
  params: Promise<{ id: string }>
}

export default async function RewardEditPage({ params }: RewardEditPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Handle "new" as a special case
  if (id === 'new') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Создать награду</h1>
          <p className="text-gray-600">Добавить новую награду в каталог</p>
        </div>
        <RewardForm />
      </div>
    )
  }

  const { data: reward } = await supabase
    .from('rewards')
    .select('*')
    .eq('id', id)
    .single()

  if (!reward) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Редактировать награду</h1>
        <p className="text-gray-600">Обновить детали награды</p>
      </div>
      <RewardForm reward={reward} />
    </div>
  )
}
