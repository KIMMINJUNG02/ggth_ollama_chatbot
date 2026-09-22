function ParamSlider({ id, label, value, onChange, min, max, step }) {
  return (
    <div className="sidebar-field">
      <label htmlFor={id}>
        {label}: {value}
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-valuetext={`${label} ${value}`}
      />
    </div>
  )
}

export default ParamSlider
