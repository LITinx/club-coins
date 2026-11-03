import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Рейтинг',
}

interface Entry {
  id: string
  display_name: string
  balance: number
}

// Podium shown left-to-right as 2nd, 1st, 3rd
const PODIUM_ORDER = [1, 0, 2]
const PODIUM_HEIGHT = ['h-28', 'h-20', 'h-14']

export default async function LeaderboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Only active students are ranked; ties are broken by id so every place is unique
  const [{ data: topData }, { data: meData }] = await Promise.all([
    supabase
      .from('users')
      .select('id, display_name, balance')
      .eq('role', 'student')
      .eq('status', 'active')
      .order('balance', { ascending: false })
      .order('id', { ascending: true })
      .limit(10),
    supabase.from('users').select('id, display_name, balance, role, status').eq('id', user.id).single(),
  ])

  const top = (topData ?? []) as Entry[]
  const me = meData as (Entry & { role: string; status: string }) | null

  // Viewer outside the top 10: their place = everyone ahead of them in the same ordering + 1
  let myRank: number | null = null
  if (me && me.role === 'student' && me.status === 'active' && !top.some((u) => u.id === me.id)) {
    const { count } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'student')
      .eq('status', 'active')
      .or(`balance.gt.${me.balance},and(balance.eq.${me.balance},id.lt.${me.id})`)
    myRank = (count ?? 0) + 1
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Рейтинг</h1>
        <p className="text-gray-600">У кого больше всего монет</p>
      </div>

      {top.length === 0 ? (
        <p className="py-12 text-center text-gray-500">Пока никого нет</p>
      ) : (
        <section aria-label="Тройка лидеров" className="grid grid-cols-3 items-end gap-3">
          {PODIUM_ORDER.map((i) => {
            const entry = top[i]
            if (!entry) return <div key={i} />
            return (
              <div key={entry.id} className="flex min-w-0 flex-col items-center text-center">
                <span
                  className={`mb-2 flex items-center justify-center rounded-full font-semibold ${
                    i === 0
                      ? 'h-16 w-16 bg-gradient-to-br from-primary-500 to-primary-700 text-xl text-on-primary dark:shadow-glow'
                      : 'h-12 w-12 bg-primary-100 text-primary-600'
                  }`}
                >
                  {entry.display_name.charAt(0).toUpperCase()}
                </span>
                <p className="w-full truncate text-sm font-medium text-gray-900">
                  {entry.display_name}
                  {entry.id === user.id && <span className="text-gray-500"> · вы</span>}
                </p>
                <p className="text-sm text-gray-500 tabular-nums">
                  {entry.balance.toLocaleString('ru-RU')} монет
                </p>
                <div
                  className={`mt-2 flex w-full justify-center rounded-t-3xl pt-3 text-2xl font-light ${PODIUM_HEIGHT[i]} ${
                    i === 0
                      ? 'bg-primary-500 text-gray-900 dark:bg-primary-600 dark:text-on-primary dark:shadow-glow'
                      : 'bg-surface text-gray-900 shadow-soft ring-1 ring-gray-200/70 dark:bg-gray-100 dark:shadow-none dark:ring-primary-500/10'
                  }`}
                >
                  {i + 1}
                </div>
              </div>
            )
          })}
        </section>
      )}

      {(top.length > 3 || myRank) && (
        <ol className="space-y-1">
          {top.slice(3).map((entry, i) => (
            <Row key={entry.id} rank={i + 4} entry={entry} isMe={entry.id === user.id} />
          ))}
          {myRank && me && (
            <>
              <li aria-hidden="true" className="py-1 text-center text-gray-400">
                …
              </li>
              <Row rank={myRank} entry={me} isMe />
            </>
          )}
        </ol>
      )}
    </div>
  )
}

function Row({ rank, entry, isMe }: { rank: number; entry: Entry; isMe: boolean }) {
  return (
    <li
      className={`flex items-center gap-3 rounded-2xl p-3 sm:gap-4 ${
        isMe ? 'bg-primary-500/10 ring-1 ring-primary-500/30' : ''
      }`}
    >
      <span className="w-8 flex-shrink-0 text-center text-sm font-medium text-gray-500 tabular-nums">
        {rank}
      </span>
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-600">
        {entry.display_name.charAt(0).toUpperCase()}
      </span>
      <p className="min-w-0 flex-1 truncate font-medium text-gray-900">
        {entry.display_name}
        {isMe && <span className="text-gray-500"> · вы</span>}
      </p>
      <span className="flex-shrink-0 font-medium text-gray-900 tabular-nums">
        {entry.balance.toLocaleString('ru-RU')} <span className="text-sm text-gray-500">монет</span>
      </span>
    </li>
  )
}
