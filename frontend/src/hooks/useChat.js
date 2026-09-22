import { useCallback, useState } from 'react'
import { sendChat } from '../api/chatApi'

let messageIdCounter = 0
const nextMessageId = () => String(messageIdCounter++)

export function useChat() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (text, settings) => {
    setMessages((prev) => [
      ...prev,
      { id: nextMessageId(), role: 'user', content: text, timestamp: Date.now() },
    ])
    setIsLoading(true)

    try {
      const response = await sendChat({
        message: text,
        model: settings.model,
        system_prompt: settings.systemPrompt,
        temperature: settings.temperature,
        top_p: settings.topP,
        num_predict: settings.numPredict,
      })
      setMessages((prev) => [
        ...prev,
        {
          id: nextMessageId(),
          role: 'assistant',
          content: response.message,
          timestamp: Date.now(),
          model: response.model,
          elapsedTime: response.elapsed_time,
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextMessageId(),
          role: 'error',
          content: '응답을 받아오지 못했습니다. 백엔드 서버 상태를 확인해주세요.',
          timestamp: Date.now(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resetConversation = useCallback(() => {
    setMessages([])
  }, [])

  return { messages, isLoading, sendMessage, resetConversation }
}
