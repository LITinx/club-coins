import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/features/logout-button'
import { NotificationBell } from '@/components/features/notification-bell'
import { MobileNav } from '@/components/features/mobile-nav'
import { MobileMenu } from '@/components/features/mobile-menu'
import { NavLink } from '@/components/ui/nav-link'
import { ThemeToggle } from '@/components/features/theme-toggle'

const navLinkClass =
  'rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 aria-[current=page]:bg-primary-600 aria-[current=page]:text-on-primary dark:aria-[current=page]:shadow-glow'

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
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-50/70 backdrop-blur-xl safe-area-inset-top dark:bg-gray-50/40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="sr-only">Coffee Coin</span>
            <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-base font-semibold text-on-primary dark:shadow-glow">
              {typedProfile?.display_name?.charAt(0).toUpperCase() || '☕'}
            </span>
            {/* User info - hidden on small screens */}
            <span className="hidden text-sm leading-tight sm:block">
              <span className="block font-medium text-gray-900">{typedProfile?.display_name}</span>
              <span className="block text-gray-500">{(typedProfile?.balance ?? 0).toLocaleString('ru-RU')} монет</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full bg-surface p-1 shadow-soft ring-1 ring-gray-200/70 md:flex dark:bg-gray-100/70 dark:shadow-none dark:ring-primary-500/15">
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

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationBell />
            {/* Mobile menu button with user info */}
            <MobileMenu
              displayName={typedProfile?.display_name ?? ''}
              balance={typedProfile?.balance ?? 0}
            />
            <div className="hidden sm:block">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Floating pill navigation (mobile) */}
      <MobileNav isAdmin={isAdmin} />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 pb-28 pt-2 sm:pt-6 md:pb-10">{children}</main>
    </div>
  )
}
