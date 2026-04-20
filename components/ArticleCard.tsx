import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { ExternalLink } from 'lucide-react'

interface Article {
  id: string
  title: string
  url: string
  source_name: string
  category: string
  published_at: string
  summary: string
  image_url: string | null
}

const categoryColors: Record<string, string> = {
  'AI Research': 'bg-purple-900/40 text-purple-300 border-purple-800',
  'AI News': 'bg-blue-900/40 text-blue-300 border-blue-800',
  'General Tech': 'bg-zinc-800 text-zinc-400 border-zinc-700',
  'AI Education': 'bg-green-900/40 text-green-300 border-green-800',
  'AI Ethics': 'bg-orange-900/40 text-orange-300 border-orange-800',
  'AI Policy': 'bg-yellow-900/40 text-yellow-300 border-yellow-800',
  'MLOps': 'bg-pink-900/40 text-pink-300 border-pink-800',
  'Data Science': 'bg-cyan-900/40 text-cyan-300 border-cyan-800',
  'AI Products': 'bg-indigo-900/40 text-indigo-300 border-indigo-800',
}

export default function ArticleCard({ article }: { article: Article }) {
  const colorClass = categoryColors[article.category] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'
  const timeAgo = (() => {
    try { return formatDistanceToNow(new Date(article.published_at), { addSuffix: true }) }
    catch { return '' }
  })()

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:border-zinc-600 hover:bg-zinc-800/60 transition-all">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-zinc-500 text-xs font-medium">{article.source_name}</span>
              <span className="text-zinc-700 text-xs">·</span>
              <span className="text-zinc-600 text-xs">{timeAgo}</span>
            </div>
            <h3 className="text-white text-sm font-medium leading-snug group-hover:text-blue-300 transition-colors line-clamp-2">
              {article.title}
            </h3>
            {article.summary && (
              <p className="text-zinc-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                {article.summary}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <ExternalLink className="h-3.5 w-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
            <Badge variant="outline" className={`text-[10px] border ${colorClass} shrink-0`}>
              {article.category}
            </Badge>
          </div>
        </div>
      </div>
    </a>
  )
}
