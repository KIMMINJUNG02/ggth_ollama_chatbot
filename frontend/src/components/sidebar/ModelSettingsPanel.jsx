import ModelSelect from './ModelSelect'
import SystemPromptField from './SystemPromptField'
import ParamSlider from './ParamSlider'
import NumPredictField from './NumPredictField'
import './ModelSettingsPanel.css'

function ModelSettingsPanel({ models, settings, onSettingsChange }) {
  return (
    <div className="model-settings">
      <h2 className="model-settings__title">모델 설정</h2>

      <ModelSelect
        models={models}
        value={settings.model}
        onChange={(model) => onSettingsChange({ model })}
      />

      <SystemPromptField
        value={settings.systemPrompt}
        onChange={(systemPrompt) => onSettingsChange({ systemPrompt })}
      />

      <ParamSlider
        id="temperature"
        label="Temperature"
        value={settings.temperature}
        onChange={(temperature) => onSettingsChange({ temperature })}
        min={0}
        max={2}
        step={0.1}
      />

      <ParamSlider
        id="top-p"
        label="Top P"
        value={settings.topP}
        onChange={(topP) => onSettingsChange({ topP })}
        min={0}
        max={1}
        step={0.05}
      />

      <NumPredictField
        value={settings.numPredict}
        onChange={(numPredict) => onSettingsChange({ numPredict })}
        min={1}
        max={2048}
      />
    </div>
  )
}

export default ModelSettingsPanel
