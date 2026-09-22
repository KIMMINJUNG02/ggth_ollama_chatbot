import { useState } from 'react'
import './ChatInput.css'

function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-input">
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요"
        disabled={disabled}
        aria-label="메시지 입력"
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        className="chat-input__send"
      >
        {disabled ? (
          <>
            <span className="chat-input__spinner" aria-hidden="true" />
            응답 생성 중...
          </>
        ) : (
          '전송'
        )}
      </button>
    </div>
  )
}

export default ChatInput
