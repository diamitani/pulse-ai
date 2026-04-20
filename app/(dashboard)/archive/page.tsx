import { createClient } from '@/lib/supabase/server'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const revalidate = 3600

async function getDigests() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('digests')
    .select('date, article_count, storage_path, summary')
    .order('date', { ascending: false })
    .limit(90)
  return data ?? []
}

export default async function ArchivePage() {
  const digests = await getDigests()

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Archive</h1>
        <p className="text-zinc-500 text-sm mt-1">{digests.length} daily digests stored</p>
      </div>

      {digests.length === 0 ? (
        <p className="text-zinc-600">No archives yet.</p>
      ) : (
        <div className="space-y-3">
          {digests.map((digest: { date: string; article_count: number; summary: string | null }) => (
            <Link key={digest.date} href={`/?date=${digest.date}`}>
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-base font-medium">
                      {format(parseISO(digest.date), 'EEEE, MMMM d, yyyy')}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400">
                      {digest.article_count} articles
                    </Badge>
                  </div>
                </CardHeader>
                {digest.summary && (
                  <CardContent>
                    <p className="text-zinc-500 text-sm line-clamp-2">
                      {digest.summary.replace(/[#*`]/g, '').slice(0, 180)}...
                    </p>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
