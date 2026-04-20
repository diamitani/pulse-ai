import { NextResponse } from 'next/server'
import { scrapeAllFeeds, pickTop50 } from '@/lib/rss-scraper'
import { generateSummary } from '@/lib/deepseek'
import { compressArticles } from '@/lib/archiver'
import { createServiceClient } from '@/lib/supabase/service'
import { format } from 'date-fns'

export const runtime = 'nodejs'
export const maxDuration = 300

export async function GET(request: Request) {
  // Allow if no CRON_SECRET set (dev), or if bearer matches
  const authHeader = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const today = format(new Date(), 'yyyy-MM-dd')

  try {
    // 1. Scrape all RSS feeds
    console.log('[cron] Scraping feeds...')
    const allArticles = await scrapeAllFeeds()
    console.log(`[cron] Fetched ${allArticles.length} articles`)

    // 2. Pick top 50
    const top50 = pickTop50(allArticles)

    // 3. Upsert all articles
    const articleRows = allArticles.map((a) => ({
      title: a.title,
      url: a.url,
      source_name: a.sourceName,
      source_url: a.sourceUrl,
      category: a.category,
      published_at: a.publishedAt,
      content: a.content,
      summary: a.summary,
      image_url: a.imageUrl,
      digest_date: today,
    }))

    const { data: insertedArticles } = await supabase
      .from('articles')
      .upsert(articleRows, { onConflict: 'url', ignoreDuplicates: false })
      .select('id, url')

    // 4. Generate AI summary
    const articlesText = top50
      .map((a) => `**${a.title}** (${a.sourceName})\n${a.summary}`)
      .join('\n\n')
    console.log('[cron] Generating summary...')
    const summary = await generateSummary(articlesText, today)

    // 5. Compress and upload archive to Supabase Storage
    const compressed = await compressArticles(allArticles, today)
    const storagePath = `archives/${today}.md.gz`
    await supabase.storage
      .from('pulse-archives')
      .upload(storagePath, compressed, {
        contentType: 'application/gzip',
        upsert: true,
      })

    // 6. Map URLs to IDs for top50
    const urlToId = new Map((insertedArticles ?? []).map((a: { id: string; url: string }) => [a.url, a.id]))
    const top50Ids = top50.map((a) => urlToId.get(a.url)).filter(Boolean)

    // 7. Upsert digest record
    await supabase.from('digests').upsert({
      date: today,
      summary,
      top_article_ids: top50Ids,
      article_count: allArticles.length,
      storage_path: storagePath,
    }, { onConflict: 'date' })

    console.log('[cron] Done.')
    return NextResponse.json({
      success: true,
      date: today,
      articlesScraped: allArticles.length,
      top50Count: top50.length,
    })
  } catch (error) {
    console.error('[cron] Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
