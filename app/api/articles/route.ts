import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const pageSize = parseInt(searchParams.get('pageSize') ?? '50')
  const category = searchParams.get('category')
  const date = searchParams.get('date')
  const search = searchParams.get('search')

  let query = supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .order('published_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (category) query = query.eq('category', category)
  if (date) query = query.eq('digest_date', date)
  if (search) query = query.ilike('title', `%${search}%`)

  const { data, count } = await query
  return NextResponse.json({ articles: data ?? [], total: count ?? 0, page, pageSize })
}
