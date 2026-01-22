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
    <div className="space-y-4 sm:space-y-6">
      {/* Horizontally scrollable admin nav on mobile */}
      <nav className="-mx-4 border-b border-gray-200 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 overflow-x-auto pb-4 scrollbar-hide scroll-smooth-touch sm:gap-4">
          <Link
            href="/dashboard/admin/members"
            className="flex-shrink-0 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-primary-600 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0 min-touch-target touch-manipulation"
          >
            Участники
          </Link>
          <Link
            href="/dashboard/admin/award"
            className="flex-shrink-0 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-primary-600 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0 min-touch-target touch-manipulation"
          >
            Начислить монеты
          </Link>
          <Link
            href="/dashboard/admin/rewards"
            className="flex-shrink-0 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-primary-600 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0 min-touch-target touch-manipulation"
          >
            Награды
          </Link>
          <Link
            href="/dashboard/admin/stats"
            className="flex-shrink-0 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-primary-600 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0 min-touch-target touch-manipulation"
          >
            Статистика
          </Link>
        </div>
      </nav>
      {children}
    </div>
  )
}
