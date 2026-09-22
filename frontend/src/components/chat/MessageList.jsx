import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import './MessageList.css'

function MessageList({ messages }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  return (
    <div className="message-list" role="log" aria-live="polite">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          role={message.role}
          content={message.content}
          timestamp={message.timestamp}
          model={message.model}
          elapsedTime={message.elapsedTime}
        />
      ))}
      <div ref={endRef} />
    </div>
  )
}

export default MessageList
