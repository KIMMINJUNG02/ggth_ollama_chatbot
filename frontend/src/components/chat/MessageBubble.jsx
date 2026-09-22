import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import './MessageBubble.css'

function formatTime(timestamp) {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

function MessageBubble({ role, content, timestamp, model, elapsedTime }) {
  const [copied, setCopied] = useState(false)
  const roleLabel = role === 'user' ? '사용자' : role === 'error' ? '오류' : 'AI'

  const metaParts = [formatTime(timestamp)]
  if (role === 'assistant' && model) metaParts.push(model)
  if (role === 'assistant' && typeof elapsedTime === 'number') metaParts.push(`${elapsedTime}초`)
  const meta = metaParts.filter(Boolean).join(' · ')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // 클립보드 접근이 차단된 환경에서는 조용히 무시한다
    }
  }

  return (
    <div className={`message-bubble message-bubble--${role}`}>
      <div className="message-bubble__header">
        <span className="message-bubble__role">{roleLabel}</span>
        {meta && <span className="message-bubble__meta">{meta}</span>}
      </div>

      {role === 'assistant' ? (
        <div className="message-bubble__content message-bubble__content--markdown">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      ) : (
        <p className="message-bubble__content">{content}</p>
      )}

      <button type="button" className="message-bubble__copy" onClick={handleCopy}>
        {copied ? '복사됨' : '복사'}
      </button>
    </div>
  )
}

export default MessageBubble
