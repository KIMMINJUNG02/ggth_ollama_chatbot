function NumPredictField({ value, onChange, min, max }) {
  return (
    <div className="sidebar-field">
      <label htmlFor="num-predict">Num Predict</label>
      <input
        id="num-predict"
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  )
}

export default NumPredictField
