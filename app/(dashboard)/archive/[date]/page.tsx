import { createClient } from '@/lib/supabase/server'
import { format, parseISO } from 'date-fns'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DigestSummary from '@/components/DigestSummary'
import ArticleFeed from '@/components/ArticleFeed'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 3600

interface Props {
  params: Promise<{ date: string }>
}

export default async function ArchiveDetailPage({ params }: Props) {
  const { date } = await params

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    notFound()
  }

  const supabase = await createClient()

  const { data: digest } = await supabase
    .from('digests')
    .select('*')
    .eq('date', date)
    .single()

  if (!digest) {
    notFound()
  }

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('digest_date', date)
    .order('published_at', { ascending: false })

  const formattedDate = format(parseISO(date), 'EEEE, MMMM d, yyyy')

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <Link
          href="/archive"
          className="inline-flex items-center gap-1.5 text-zinc-500 text-sm hover:text-zinc-300 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to archive
        </Link>
        <h1 className="text-2xl font-bold text-white">{formattedDate}</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {digest.article_count} articles collected
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <DigestSummary summary={digest.summary} articleCount={digest.article_count} date={date} />
        </div>
        <div className="lg:col-span-3">
          <ArticleFeed articles={articles ?? []} />
        </div>
      </div>
    </div>
  )
}
