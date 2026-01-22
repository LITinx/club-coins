import { Card, CardContent } from '@/components/ui/card'

interface StatsCardProps {
  title: string
  value: number | string
  description?: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
  return (
    <Card variant="bordered">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500 truncate sm:text-sm">{title}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 truncate sm:mt-2 sm:text-3xl">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {description && (
              <p className="mt-1 text-xs text-gray-500 truncate sm:text-sm">{description}</p>
            )}
            {trend && (
              <div className={`mt-1 flex items-center text-xs sm:mt-2 sm:text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                <svg
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${trend.isPositive ? '' : 'rotate-180'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                <span className="ml-1">{trend.value}%</span>
              </div>
            )}
          </div>
          <div className="flex-shrink-0 rounded-lg bg-primary-100 p-2 text-primary-600 sm:p-3 [&_svg]:h-5 [&_svg]:w-5 sm:[&_svg]:h-6 sm:[&_svg]:w-6">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
