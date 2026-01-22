export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary-50 to-white px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary-600">Club Coins</h1>
        <p className="mt-2 text-gray-600">Student Club Rewards System</p>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
