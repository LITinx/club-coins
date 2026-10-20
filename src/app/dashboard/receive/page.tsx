import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import QRCode from 'qrcode'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = {
  title: 'Получить монеты',
}

export default async function ReceivePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('display_name')
    .eq('id', user.id)
    .single()

  // Use the host the recipient opened the app on, so the link works for whoever scans it
  const headerList = await headers()
  const proto = (headerList.get('x-forwarded-proto') ?? 'http').split(',')[0]
  const transferUrl = `${proto}://${headerList.get('host')}/dashboard/transfer?to=${user.id}`
  const qrSvg = await QRCode.toString(transferUrl, { type: 'svg', margin: 1 })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Получить монеты</h1>
        <p className="text-gray-600">
          Покажите этот QR-код отправителю — пусть отсканирует его камерой телефона
        </p>
      </div>

      <Card variant="bordered">
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <div
            role="img"
            aria-label="QR-код для перевода монет"
            className="w-64 max-w-full rounded-lg bg-white p-2 [&>svg]:h-auto [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
          <p className="text-lg font-semibold text-gray-900">
            {(profile as { display_name: string } | null)?.display_name}
          </p>
          <Link
            href="/dashboard/transfer"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Назад к переводу
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
