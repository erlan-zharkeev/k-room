import './style.scss'

import type { IAppSelectProps } from './config'

export const AppSelect = ({
  options,
  value,
  onChange,
  multiple = false,
  disabled = false
}: IAppSelectProps) => {
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
