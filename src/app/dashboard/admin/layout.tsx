import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NavLink } from '@/components/ui/nav-link'

const tabClass =
  'flex-shrink-0 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-primary-600 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0 min-touch-target touch-manipulation aria-[current=page]:bg-primary-100 aria-[current=page]:text-primary-700 sm:aria-[current=page]:bg-transparent'

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
    <div className="space-y-4 sm:space-y-6">
      {/* Horizontally scrollable admin nav on mobile */}
      <nav className="-mx-4 border-b border-gray-200 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 overflow-x-auto pb-4 scrollbar-hide scroll-smooth-touch sm:gap-4">
          <NavLink href="/dashboard/admin/members" className={tabClass}>
            Участники
          </NavLink>
          <NavLink href="/dashboard/admin/award" className={tabClass}>
            Начислить монеты
          </NavLink>
          <NavLink href="/dashboard/admin/rewards" className={tabClass}>
            Награды
          </NavLink>
          <NavLink href="/dashboard/admin/stats" className={tabClass}>
            Статистика
          </NavLink>
        </div>
      </nav>
      {children}
    </div>
  )
}
