import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') ?? format(new Date(), 'yyyy-MM-dd')

  const { data: digest } = await supabase
    .from('digests')
    .select('*')
    .eq('date', date)
    .single()

  if (!digest) {
    return NextResponse.json({ digest: null, articles: [] })
  }

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('digest_date', date)
    .order('published_at', { ascending: false })

  return NextResponse.json({ digest, articles: articles ?? [] })
}
