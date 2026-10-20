import type { Metadata, Viewport } from 'next'
import { Onest } from 'next/font/google'
import { ToastProvider } from '@/components/ui/toast'
import '@/styles/globals.css'

const onest = Onest({ subsets: ['latin', 'cyrillic'], variable: '--font-sans' })

// Runs before paint so a stored/system dark theme doesn't flash light first
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`

export const metadata: Metadata = {
  title: {
    default: 'Coffee Coin',
    template: '%s | Coffee Coin',
  },
  description: 'Система виртуальной валюты и наград студенческого клуба',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Coffee Coin',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbf9f4' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0c0f' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={onest.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
