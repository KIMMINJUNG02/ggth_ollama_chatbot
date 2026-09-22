import './ChatLayout.css'

function ChatLayout({ sidebar, children, isSidebarOpen, onToggleSidebar }) {
  return (
    <div className="chat-layout">
      {isSidebarOpen ? (
        <aside className="chat-layout__sidebar">
          <button
            type="button"
            className="chat-layout__sidebar-toggle"
            onClick={onToggleSidebar}
            aria-expanded="true"
          >
            ‹ 설정 숨기기
          </button>
          {sidebar}
        </aside>
      ) : (
        <button
          type="button"
          className="chat-layout__sidebar-toggle chat-layout__sidebar-toggle--collapsed"
          onClick={onToggleSidebar}
          aria-expanded="false"
          aria-label="설정 패널 보이기"
        >
          ›
        </button>
      )}
      <div className="chat-layout__main">{children}</div>
    </div>
  )
}

export default ChatLayout
