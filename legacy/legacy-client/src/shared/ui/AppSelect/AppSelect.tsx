import './style.scss'

import { AppSelectProps } from './internals/types'

export const AppSelect = ({ options, value, onChange, multiple = false, disabled = false }: AppSelectProps) => {
  return (
    <select
      className="app-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      multiple={multiple}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
