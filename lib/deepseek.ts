import OpenAI from 'openai'

export const DEEPSEEK_MODEL = 'deepseek-chat'

function getClient() {
  return new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY!,
    baseURL: 'https://api.deepseek.com',
  })
}

export function getDeepSeek() {
  return getClient()
}

export async function generateSummary(articlesText: string, date: string): Promise<string> {
  const client = getClient()
  const response = await client.chat.completions.create({
    model: DEEPSEEK_MODEL,
    messages: [
      {
        role: 'system',
        content: `You are an AI news analyst. Synthesize today's top AI developments into a sharp, insight-driven briefing. Be concise, authoritative, and highlight what actually matters. No fluff.`,
      },
      {
        role: 'user',
        content: `Date: ${date}\n\nToday's articles:\n${articlesText}\n\nWrite a 3-5 paragraph executive briefing covering: (1) the single biggest story, (2) key trends across research/products/policy, (3) what to watch next. Use markdown formatting.`,
      },
    ],
    max_tokens: 1024,
  })
  return response.choices[0].message.content ?? ''
}
