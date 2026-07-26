import { SOURCES } from '@/lib/sources'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink, Rss } from 'lucide-react'

export default function SourcesPage() {
  const byCategory = SOURCES.reduce<Record<string, typeof SOURCES>>((acc, s) => {
    acc[s.category] = acc[s.category] ?? []
    acc[s.category].push(s)
    return acc
  }, {})

  const categories = Object.keys(byCategory).sort()

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Sources</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {SOURCES.length} feeds across {categories.length} categories, scraped daily at 6 AM UTC
        </p>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">{category}</h2>
              <Badge variant="secondary" className="text-[10px] bg-zinc-800 text-zinc-500 border-zinc-700">
                {byCategory[category].length}
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {byCategory[category].map((source) => (
                <Card key={source.rssUrl} className="bg-zinc-900 border-zinc-800 hover:border-zinc-600 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Rss className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                        <span className="text-sm font-medium text-white truncate">{source.name}</span>
                      </div>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-600 hover:text-zinc-400 shrink-0"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
