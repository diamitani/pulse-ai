'use client'

import { useState, useMemo } from 'react'
import ArticleCard from './ArticleCard'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'

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

export default function ArticleFeed({ articles }: { articles: Article[] }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = useMemo(
    () => [...new Set(articles.map((a) => a.category))].sort(),
    [articles]
  )

  const filtered = useMemo(() => {
    let result = articles
    if (activeCategory) {
      result = result.filter((a) => a.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.source_name.toLowerCase().includes(q) ||
          a.summary?.toLowerCase().includes(q)
      )
    }
    return result
  }, [articles, activeCategory, search])

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="pl-9 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            !activeCategory
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          All ({articles.length})
        </button>
        {categories.map((cat) => {
          const count = articles.filter((a) => a.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {cat} ({count})
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-zinc-500">
          {filtered.length} article{filtered.length !== 1 ? 's' : ''}
          {activeCategory && ` in ${activeCategory}`}
          {search && ` matching "${search}"`}
        </h2>
      </div>

      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((article) => <ArticleCard key={article.id} article={article} />)
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-500 text-sm">No articles match your filters.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory(null) }}
              className="text-blue-400 text-sm mt-2 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
