import './ChatHeader.css'

function ChatHeader({ onReset }) {
  return (
    <header className="chat-header">
      <div>
        <h1>Local LLM Chat</h1>
        <p>React + FastAPI + Ollama 기반 로컬 AI 채팅 앱</p>
      </div>
      <button type="button" className="chat-header__reset" onClick={onReset}>
        대화 초기화
      </button>
    </header>
  )
}

export default ChatHeader
