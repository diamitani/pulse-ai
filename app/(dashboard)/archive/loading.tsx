import { Skeleton } from '@/components/ui/skeleton'

export default function ArchiveLoading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <Skeleton className="h-8 w-32 bg-zinc-800" />
        <Skeleton className="h-4 w-48 bg-zinc-800 mt-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-3">
            <Skeleton className="h-4 w-40 bg-zinc-800" />
            <Skeleton className="h-3 w-full bg-zinc-800" />
            <Skeleton className="h-3 w-2/3 bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  )
}
