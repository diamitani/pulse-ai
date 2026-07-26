import { createClient } from '@/lib/supabase/server'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, FileText } from 'lucide-react'

export const revalidate = 3600

async function getDigests() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('digests')
    .select('date, article_count, summary')
    .order('date', { ascending: false })
    .limit(90)
  return data ?? []
}

export default async function ArchivePage() {
  const digests = await getDigests()

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Archive</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {digests.length} daily digest{digests.length !== 1 ? 's' : ''} stored
        </p>
      </div>

      {digests.length === 0 ? (
        <div className="text-center py-24">
          <Calendar className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">No archives yet</h2>
          <p className="text-zinc-500 text-sm max-w-sm mx-auto">
            Once the daily digest runs, past briefings will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {digests.map((digest: { date: string; article_count: number; summary: string | null }) => (
            <Link key={digest.date} href={`/archive/${digest.date}`}>
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-sm font-medium">
                      {format(parseISO(digest.date), 'EEEE, MMMM d, yyyy')}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400">
                      <FileText className="h-3 w-3 mr-1" />
                      {digest.article_count}
                    </Badge>
                  </div>
                </CardHeader>
                {digest.summary && (
                  <CardContent>
                    <p className="text-zinc-500 text-xs line-clamp-3 leading-relaxed">
                      {digest.summary.replace(/[#*`]/g, '').slice(0, 200)}
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
