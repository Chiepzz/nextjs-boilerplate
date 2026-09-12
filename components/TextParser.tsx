import { AlertTriangle } from 'lucide-react'
import { Fragment } from 'react'

interface TextParserProps {
  text: string
  className?: string
}

// Matches [!]content[!]
const ALERT_PATTERN = /\[!\](.*?)\[!\]/g

export function TextParser({ text, className }: TextParserProps) {
  if (!text) return null

  const parts: { type: 'text' | 'alert'; content: string }[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  ALERT_PATTERN.lastIndex = 0
  while ((match = ALERT_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'alert', content: match[1] })
    lastIndex = ALERT_PATTERN.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.type === 'alert') {
          return (
            <span
              key={i}
              className="mx-0.5 inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-[0.85em] font-medium leading-normal text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400"
            >
              <AlertTriangle className="h-3 w-3 shrink-0" strokeWidth={2} />
              {part.content}
            </span>
          )
        }
        return <Fragment key={i}>{part.content}</Fragment>
      })}
    </span>
  )
}