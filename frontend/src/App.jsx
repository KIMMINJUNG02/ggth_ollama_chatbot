import { useState } from 'react'
import ChatLayout from './components/layout/ChatLayout'
import ModelSettingsPanel from './components/sidebar/ModelSettingsPanel'
import ChatMain from './components/chat/ChatMain'
import { useModels } from './hooks/useModels'
import { useChat } from './hooks/useChat'

const DEFAULT_SETTINGS = {
  model: '',
  systemPrompt: '너는 초보자를 돕는 친절한 AI 강사다.',
  temperature: 0.4,
  topP: 0.55,
  numPredict: 256,
}

function App() {
  const { models, isLoading: modelsLoading, error: modelsError } = useModels()
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { messages, isLoading: isChatLoading, sendMessage, resetConversation } = useChat()

  // 모델 목록이 로딩되기 전에는 settings.model이 비어있을 수 있으므로,
  // 아직 사용자가 직접 선택하지 않았다면 목록의 첫 번째 모델을 화면/요청 값으로 사용한다.
  const effectiveSettings = { ...settings, model: settings.model || models[0] || '' }

  const handleSettingsChange = (patch) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }

  const handleSend = (text) => {
    sendMessage(text, effectiveSettings)
  }

  let sidebarContent
  if (modelsLoading) {
    sidebarContent = <p className="sidebar-status">모델 목록을 불러오는 중...</p>
  } else if (modelsError) {
    sidebarContent = (
      <p className="sidebar-status sidebar-status--error">
        모델 목록을 불러오지 못했습니다. 백엔드 서버가 실행 중인지 확인해주세요.
      </p>
    )
  } else {
    sidebarContent = (
      <ModelSettingsPanel
        models={models}
        settings={effectiveSettings}
        onSettingsChange={handleSettingsChange}
      />
    )
  }

  return (
    <ChatLayout
      sidebar={sidebarContent}
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
    >
      <ChatMain
        messages={messages}
        isLoading={isChatLoading}
        onReset={resetConversation}
        onSend={handleSend}
      />
    </ChatLayout>
  )
}

export default App
