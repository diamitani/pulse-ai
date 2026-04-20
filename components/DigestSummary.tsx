import { format, parseISO } from 'date-fns'
import { Sparkles } from 'lucide-react'

interface DigestSummaryProps {
  summary: string
  articleCount: number
  date: string
}

export default function DigestSummary({ summary, articleCount, date }: DigestSummaryProps) {
  const formattedDate = (() => {
    try { return format(parseISO(date), 'MMMM d') }
    catch { return date }
  })()

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 sticky top-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-5 rounded bg-blue-600/20 flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-blue-400" />
        </div>
        <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">AI Briefing</span>
      </div>

      <div className="text-zinc-300 text-sm leading-relaxed prose prose-sm prose-invert max-w-none">
        {summary.split('\n').map((line, i) => {
          if (line.startsWith('## ') || line.startsWith('# ')) {
            return <h3 key={i} className="text-white font-semibold text-sm mt-3 mb-1">{line.replace(/^#+\s/, '')}</h3>
          }
          if (line.startsWith('**') && line.endsWith('**')) {
            return <p key={i} className="font-semibold text-zinc-200 mt-2">{line.replace(/\*\*/g, '')}</p>
          }
          if (!line.trim()) return <br key={i} />
          return <p key={i} className="text-zinc-400 text-xs leading-relaxed">{line.replace(/\*\*/g, '')}</p>
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-600">
        <span>{formattedDate} digest</span>
        <span>{articleCount} articles sourced</span>
      </div>
    </div>
  )
}
