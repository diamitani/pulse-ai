import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { deepseek, DEEPSEEK_MODEL } from '@/lib/deepseek'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { messages, sessionId, dateFilter } = await request.json()

  // Fetch relevant articles as context
  let query = supabase
    .from('articles')
    .select('title, url, source_name, content, published_at, category')
    .order('published_at', { ascending: false })
    .limit(30)

  if (dateFilter) {
    query = query.eq('digest_date', dateFilter)
  }

  const { data: articles } = await query

  const context = (articles ?? [])
    .map((a: { title: string; source_name: string; url: string; content: string }) =>
      `[${a.title}](${a.url}) — ${a.source_name}\n${a.content?.slice(0, 400) ?? ''}`
    )
    .join('\n\n---\n\n')

  const systemPrompt = `You are Pulse, an AI research assistant with access to today's AI news articles. Answer questions about current AI developments, trends, and research based on the articles provided. Be precise, cite sources by name, and stay grounded in the provided context.

<context>
${context}
</context>

If the user asks about something not in the context, say so clearly and share what you do know.`

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const completion = await deepseek.chat.completions.create({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
        max_tokens: 1024,
      })

      let fullContent = ''
      for await (const chunk of completion) {
        const delta = chunk.choices[0]?.delta?.content ?? ''
        if (delta) {
          fullContent += delta
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`))
        }
      }

      // Save assistant message to DB
      if (sessionId) {
        const lastUserMsg = [...messages].reverse().find((m: { role: string }) => m.role === 'user')
        await supabase.from('chat_messages').insert([
          { session_id: sessionId, role: 'user', content: lastUserMsg?.content ?? '' },
          { session_id: sessionId, role: 'assistant', content: fullContent },
        ])
      }

      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
