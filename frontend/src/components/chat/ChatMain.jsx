import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import './ChatMain.css'

function ChatMain({ messages, isLoading, onReset, onSend }) {
  return (
    <div className="chat-main">
      <ChatHeader onReset={onReset} />
      <MessageList messages={messages} />
      <ChatInput onSend={onSend} disabled={isLoading} />
    </div>
  )
}

export default ChatMain
