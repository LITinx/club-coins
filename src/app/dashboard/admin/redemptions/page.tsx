import { createClient } from '@/lib/supabase/server'
import { RedemptionList, type AdminRedemption } from '@/components/features/admin/redemption-list'

export const metadata = {
  title: 'Выдача наград',
}

const columns = 'id, amount, created_at, fulfilled_at, from_user:users!transactions_from_user_id_fkey(display_name), reward:rewards(name)'

export default async function AdminRedemptionsPage() {
  const supabase = await createClient()

  const { data: pending } = await supabase
    .from('transactions')
    .select(columns)
    .eq('type', 'redemption')
    .is('fulfilled_at', null)
    .order('created_at', { ascending: true })

  const { data: fulfilled } = await supabase
    .from('transactions')
    .select(columns)
    .eq('type', 'redemption')
    .not('fulfilled_at', 'is', null)
    .order('fulfilled_at', { ascending: false })
    .limit(20)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Выдача наград</h1>
        <p className="text-gray-600">
          Сверьте код из приложения студента и отметьте награду выданной
        </p>
      </div>

      <RedemptionList
        pending={(pending ?? []) as unknown as AdminRedemption[]}
        fulfilled={(fulfilled ?? []) as unknown as AdminRedemption[]}
      />
    </div>
  )
}
