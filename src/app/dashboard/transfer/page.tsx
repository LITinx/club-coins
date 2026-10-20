import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TransferForm } from '@/components/forms/transfer-form'

export const metadata = {
  title: 'Перевод монет',
}

interface TransferPageProps {
  searchParams: Promise<{ to?: string }>
}

export default async function TransferPage({ searchParams }: TransferPageProps) {
  const { to } = await searchParams
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

  // Recipient from a scanned QR code; the name always comes from the DB, never the URL
  let preselectedUser = null
  if (to && to !== user.id) {
    const { data: recipient } = await supabase
      .from('users')
      .select('id, display_name, email')
      .eq('id', to)
      .eq('status', 'active')
      .maybeSingle()
    preselectedUser = recipient
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Перевод монет</h1>
          <p className="text-gray-600">Отправьте монеты другому участнику клуба</p>
        </div>
        <Link
          href="/dashboard/receive"
          className="inline-flex h-10 flex-shrink-0 items-center rounded-full border border-gray-300 px-4 text-sm font-medium text-gray-900 hover:bg-gray-50"
        >
          Мой QR
        </Link>
      </div>

      <TransferForm
        currentBalance={typedProfile?.balance ?? 0}
        currentUserId={user.id}
        preselectedUser={preselectedUser}
      />
    </div>
  )
}
