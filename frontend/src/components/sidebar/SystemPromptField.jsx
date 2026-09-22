function SystemPromptField({ value, onChange }) {
  return (
    <div className="sidebar-field">
      <label htmlFor="system-prompt">시스템 프롬프트</label>
      <textarea
        id="system-prompt"
        rows={5}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

export default SystemPromptField
