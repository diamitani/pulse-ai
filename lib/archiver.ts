import { gzip } from 'zlib'
import { promisify } from 'util'
import type { Article } from './rss-scraper'

const gzipAsync = promisify(gzip)

export async function compressArticles(articles: Article[], date: string): Promise<Buffer> {
  const doc = buildMarkdownDoc(articles, date)
  const compressed = await gzipAsync(Buffer.from(doc, 'utf-8'))
  return compressed
}

function buildMarkdownDoc(articles: Article[], date: string): string {
  const lines: string[] = [
    `# Pulse AI — Daily Archive`,
    `**Date:** ${date}`,
    `**Total Articles:** ${articles.length}`,
    '',
  ]

  const byCategory = articles.reduce<Record<string, Article[]>>((acc, a) => {
    acc[a.category] = acc[a.category] ?? []
    acc[a.category].push(a)
    return acc
  }, {})

  for (const [category, items] of Object.entries(byCategory)) {
    lines.push(`## ${category}`, '')
    for (const item of items) {
      lines.push(`### ${item.title}`)
      lines.push(`- **Source:** [${item.sourceName}](${item.sourceUrl})`)
      lines.push(`- **URL:** ${item.url}`)
      lines.push(`- **Published:** ${item.publishedAt}`)
      if (item.content) {
        lines.push(``, item.content.slice(0, 800))
      }
      lines.push('')
    }
  }

  return lines.join('\n')
}
