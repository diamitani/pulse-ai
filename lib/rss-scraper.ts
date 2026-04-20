import Parser from 'rss-parser'
import { SOURCES, type Source } from './sources'

export interface Article {
  title: string
  url: string
  sourceName: string
  sourceUrl: string
  category: string
  publishedAt: string
  content: string
  summary: string
  imageUrl: string | null
}

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'PulseAI/1.0 RSS Reader' },
})

async function fetchFeed(source: Source): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(source.rssUrl)
    const cutoff = new Date()
    cutoff.setHours(cutoff.getHours() - 48) // last 48h window for daily runs

    return feed.items
      .filter((item) => {
        const pub = item.pubDate ? new Date(item.pubDate) : null
        return !pub || pub >= cutoff
      })
      .slice(0, 20) // max 20 per source
      .map((item) => ({
        title: item.title ?? 'Untitled',
        url: item.link ?? item.guid ?? '',
        sourceName: source.name,
        sourceUrl: source.url,
        category: source.category,
        publishedAt: item.pubDate ?? new Date().toISOString(),
        content: item.contentSnippet ?? item.summary ?? item.content ?? '',
        summary: item.contentSnippet?.slice(0, 300) ?? '',
        imageUrl: extractImage(item),
      }))
      .filter((a) => a.url)
  } catch {
    return []
  }
}

function extractImage(item: Parser.Item): string | null {
  const media = (item as Record<string, unknown>)['media:thumbnail'] as { $?: { url?: string } } | undefined
  if (media?.['$']?.url) return media['$'].url
  const enc = item.enclosure
  if (enc?.type?.startsWith('image/')) return enc.url ?? null
  return null
}

export async function scrapeAllFeeds(): Promise<Article[]> {
  const results = await Promise.allSettled(SOURCES.map(fetchFeed))
  const articles: Article[] = []
  for (const r of results) {
    if (r.status === 'fulfilled') articles.push(...r.value)
  }
  // Deduplicate by URL
  const seen = new Set<string>()
  return articles.filter((a) => {
    if (seen.has(a.url)) return false
    seen.add(a.url)
    return true
  })
}

export function scoreArticle(article: Article): number {
  let score = 0
  const title = article.title.toLowerCase()
  const highValueTerms = ['gpt', 'llm', 'model', 'released', 'launches', 'open source', 'benchmark', 'agent', 'deepseek', 'openai', 'anthropic', 'gemini', 'claude', 'o3', 'o4', 'research', 'paper']
  for (const term of highValueTerms) {
    if (title.includes(term)) score += 2
  }
  // Boost AI-specific sources
  const aiCategories = ['AI Research', 'AI News', 'AI Ethics', 'AI Products', 'MLOps']
  if (aiCategories.includes(article.category)) score += 3
  // Recency boost
  const age = Date.now() - new Date(article.publishedAt).getTime()
  const hoursOld = age / (1000 * 60 * 60)
  if (hoursOld < 6) score += 4
  else if (hoursOld < 12) score += 2
  else if (hoursOld < 24) score += 1
  return score
}

export function pickTop50(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => scoreArticle(b) - scoreArticle(a)).slice(0, 50)
}
