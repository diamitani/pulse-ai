import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import DigestSummary from '@/components/DigestSummary'
import ArticleCard from '@/components/ArticleCard'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export const revalidate = 3600 // revalidate every hour

async function getDigest(date: string) {
  const supabase = await createClient()

  const { data: digest } = await supabase
    .from('digests')
    .select('*')
    .eq('date', date)
    .single()

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('digest_date', date)
    .order('published_at', { ascending: false })

  return { digest, articles: articles ?? [] }
}

export default async function HomePage() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const { digest, articles } = await getDigest(today)

  const categories = [...new Set(articles.map((a: { category: string }) => a.category))]

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-white">Today&apos;s Briefing</h1>
          <span className="text-zinc-500 text-sm">{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
        </div>
        <div className="flex gap-2 flex-wrap mt-3">
          {categories.map((cat) => (
            <Badge key={cat as string} variant="secondary" className="text-xs bg-zinc-800 text-zinc-400 border-zinc-700">
              {cat as string}
            </Badge>
          ))}
        </div>
      </div>

      {!digest && articles.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary panel */}
          <div className="lg:col-span-1">
            {digest ? (
              <DigestSummary summary={digest.summary} articleCount={digest.article_count} date={today} />
            ) : (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-3">
                <Skeleton className="h-4 w-32 bg-zinc-800" />
                <Skeleton className="h-3 w-full bg-zinc-800" />
                <Skeleton className="h-3 w-5/6 bg-zinc-800" />
                <Skeleton className="h-3 w-4/6 bg-zinc-800" />
              </div>
            )}
          </div>

          {/* Article grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                Top Articles — {articles.length} total
              </h2>
            </div>
            <div className="space-y-3">
              {articles.slice(0, 50).map((article: {
                id: string
                title: string
                url: string
                source_name: string
                category: string
                published_at: string
                summary: string
                image_url: string | null
              }) => (
                <ArticleCard key={article.id} article={article} />
              ))}
              {articles.length === 0 && (
                <p className="text-zinc-600 text-sm">No articles yet today. The daily digest runs automatically.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-24">
      <div className="text-5xl mb-4">📡</div>
      <h2 className="text-lg font-semibold text-white mb-2">No digest yet for today</h2>
      <p className="text-zinc-500 text-sm max-w-sm mx-auto">
        The daily digest runs automatically at 6 AM UTC. You can also trigger it manually from the settings.
      </p>
    </div>
  )
}
