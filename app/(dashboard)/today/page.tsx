import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import DigestSummary from '@/components/DigestSummary'
import ArticleFeed from '@/components/ArticleFeed'

export const revalidate = 3600

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

export default async function TodayPage() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const { digest, articles } = await getDigest(today)

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-white">Today&apos;s Briefing</h1>
          <span className="text-zinc-500 text-sm">{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
        </div>
      </div>

      {!digest && articles.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            {digest && (
              <DigestSummary summary={digest.summary} articleCount={digest.article_count} date={today} />
            )}
          </div>
          <div className="lg:col-span-3">
            <ArticleFeed articles={articles} />
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
        The daily digest runs automatically at 6 AM UTC. Check back soon or trigger it manually from the API.
      </p>
    </div>
  )
}
