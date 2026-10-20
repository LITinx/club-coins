export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-light tracking-tight text-gray-900 dark:text-primary-600 dark:[text-shadow:0_0_32px_rgb(var(--primary-500)/0.5)]">Coffee Coin</h1>
        <p className="mt-2 text-gray-600">Система наград студенческого клуба</p>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
