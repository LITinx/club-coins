import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile as { role: string }).role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      <nav className="flex gap-4 border-b border-gray-200 pb-4">
        <Link
          href="/dashboard/admin/members"
          className="text-sm font-medium text-gray-600 hover:text-primary-600"
        >
          Members
        </Link>
        <Link
          href="/dashboard/admin/award"
          className="text-sm font-medium text-gray-600 hover:text-primary-600"
        >
          Award Coins
        </Link>
        <Link
          href="/dashboard/admin/rewards"
          className="text-sm font-medium text-gray-600 hover:text-primary-600"
        >
          Manage Rewards
        </Link>
        <Link
          href="/dashboard/admin/stats"
          className="text-sm font-medium text-gray-600 hover:text-primary-600"
        >
          Statistics
        </Link>
      </nav>
      {children}
    </div>
  )
}
