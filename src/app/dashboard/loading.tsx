import { Skeleton, TransactionListSkeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-xl space-y-10 pt-6 sm:pt-10">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-20 w-56 rounded-3xl" />
      </div>
      <TransactionListSkeleton />
    </div>
  )
}
