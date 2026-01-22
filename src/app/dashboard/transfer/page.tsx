import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TransferForm } from '@/components/forms/transfer-form'

export const metadata = {
  title: 'Transfer Coins',
}

export default async function TransferPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's current balance
  const { data: profile } = await supabase
    .from('users')
    .select('balance')
    .eq('id', user.id)
    .single()

  const typedProfile = profile as { balance: number } | null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transfer Coins</h1>
        <p className="text-gray-600">Send coins to another club member</p>
      </div>

      <TransferForm currentBalance={typedProfile?.balance ?? 0} currentUserId={user.id} />
    </div>
  )
}
