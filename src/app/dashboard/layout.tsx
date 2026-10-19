import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/features/logout-button'
import { NotificationBell } from '@/components/features/notification-bell'
import { MobileNav } from '@/components/features/mobile-nav'
import { MobileMenu } from '@/components/features/mobile-menu'
import { NavLink } from '@/components/ui/nav-link'

const navLinkClass =
  'text-sm font-medium text-gray-600 hover:text-gray-900 aria-[current=page]:text-primary-600'

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
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white safe-area-inset-top">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16">
          <Link href="/dashboard" className="text-lg font-bold text-primary-600 sm:text-xl">
            Coffee Coin
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <NavLink href="/dashboard" exact className={navLinkClass}>
              Главная
            </NavLink>
            <NavLink href="/dashboard/history" className={navLinkClass}>
              История
            </NavLink>
            <NavLink href="/dashboard/transfer" className={navLinkClass}>
              Перевод
            </NavLink>
            <NavLink href="/dashboard/rewards" className={navLinkClass}>
              Награды
            </NavLink>
            {isAdmin && (
              <NavLink href="/dashboard/admin" className={navLinkClass}>
                Админ
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <NotificationBell />
            {/* User info - hidden on small screens */}
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-gray-900">{typedProfile?.display_name}</p>
              <p className="text-xs text-primary-600">{typedProfile?.balance ?? 0} монет</p>
            </div>
            {/* Mobile menu button with user info */}
            <MobileMenu
              displayName={typedProfile?.display_name ?? ''}
              balance={typedProfile?.balance ?? 0}
              isAdmin={isAdmin}
            />
            <div className="hidden sm:block">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation with active states */}
      <MobileNav isAdmin={isAdmin} />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-4 sm:pt-6 md:pb-6">{children}</main>
    </div>
  )
}
