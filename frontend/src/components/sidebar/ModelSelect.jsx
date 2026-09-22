function ModelSelect({ models, value, onChange }) {
  return (
    <div className="sidebar-field">
      <label htmlFor="model-select">모델</label>
      <select
        id="model-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ModelSelect
