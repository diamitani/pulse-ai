'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export default function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {role === 'assistant' && (
        <Avatar className="h-7 w-7 shrink-0 mt-0.5">
          <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">P</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`max-w-2xl rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          role === 'user'
            ? 'bg-blue-600 text-white rounded-tr-sm'
            : 'bg-zinc-900 text-zinc-200 rounded-tl-sm border border-zinc-800'
        }`}
      >
        {content ? (
          <MarkdownContent content={content} />
        ) : isStreaming ? (
          <span className="inline-flex gap-1 text-zinc-500">
            <span className="animate-pulse">·</span>
            <span className="animate-pulse" style={{ animationDelay: '100ms' }}>·</span>
            <span className="animate-pulse" style={{ animationDelay: '200ms' }}>·</span>
          </span>
        ) : null}
      </div>
      {role === 'user' && (
        <Avatar className="h-7 w-7 shrink-0 mt-0.5">
          <AvatarFallback className="bg-zinc-700 text-white text-xs">U</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n')

  return (
    <div className="space-y-1.5 whitespace-pre-wrap">
      {lines.map((line, i) => {
        if (line.startsWith('### ')) {
          return <h4 key={i} className="font-semibold text-white text-sm mt-2">{line.slice(4)}</h4>
        }
        if (line.startsWith('## ')) {
          return <h3 key={i} className="font-semibold text-white text-sm mt-2">{line.slice(3)}</h3>
        }
        if (line.startsWith('# ')) {
          return <h2 key={i} className="font-bold text-white mt-2">{line.slice(2)}</h2>
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return <p key={i} className="pl-3 before:content-['•'] before:mr-2 before:text-zinc-500">{formatInline(line.slice(2))}</p>
        }
        if (line.startsWith('```')) {
          return null
        }
        if (!line.trim()) {
          return <br key={i} />
        }
        return <p key={i}>{formatInline(line)}</p>
      })}
    </div>
  )
}

function formatInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-zinc-800 px-1 py-0.5 rounded text-xs font-mono text-blue-300">{part.slice(1, -1)}</code>
    }
    const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/)
    if (linkMatch) {
      return <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{linkMatch[1]}</a>
    }
    return part
  })
}
