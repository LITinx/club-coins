import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/features/logout-button'
import { NotificationBell } from '@/components/features/notification-bell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile with role
  const { data: profile } = await supabase
    .from('users')
    .select('display_name, role, balance')
    .eq('id', user.id)
    .single()

  const typedProfile = profile as { display_name: string; role: string; balance: number } | null
  const isAdmin = typedProfile?.role === 'admin'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/dashboard" className="text-xl font-bold text-primary-600">
            Club Coins
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/history"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              History
            </Link>
            <Link
              href="/dashboard/transfer"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Transfer
            </Link>
            <Link
              href="/dashboard/rewards"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Rewards
            </Link>
            {isAdmin && (
              <Link
                href="/dashboard/admin/members"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{typedProfile?.display_name}</p>
              <p className="text-xs text-primary-600">{typedProfile?.balance ?? 0} coins</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white md:hidden">
        <div className="grid h-16 grid-cols-4 items-center">
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 text-xs text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Home
          </Link>
          <Link
            href="/dashboard/history"
            className="flex flex-col items-center gap-1 text-xs text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            History
          </Link>
          <Link
            href="/dashboard/transfer"
            className="flex flex-col items-center gap-1 text-xs text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            Transfer
          </Link>
          <Link
            href="/dashboard/rewards"
            className="flex flex-col items-center gap-1 text-xs text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Rewards
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 md:pb-6">{children}</main>
    </div>
  )
}
