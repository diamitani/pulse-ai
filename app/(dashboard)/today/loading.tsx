import { Skeleton } from '@/components/ui/skeleton'

export default function TodayLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <Skeleton className="h-8 w-48 bg-zinc-800" />
        <Skeleton className="h-4 w-32 bg-zinc-800 mt-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-3">
            <Skeleton className="h-4 w-24 bg-zinc-800" />
            <Skeleton className="h-3 w-full bg-zinc-800" />
            <Skeleton className="h-3 w-5/6 bg-zinc-800" />
            <Skeleton className="h-3 w-4/6 bg-zinc-800" />
            <Skeleton className="h-3 w-full bg-zinc-800" />
            <Skeleton className="h-3 w-3/4 bg-zinc-800" />
          </div>
        </div>
        <div className="lg:col-span-3 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <Skeleton className="h-3 w-24 bg-zinc-800 mb-2" />
              <Skeleton className="h-4 w-3/4 bg-zinc-800 mb-2" />
              <Skeleton className="h-3 w-full bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
