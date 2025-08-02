import './style.scss'

import type { IAppSelectProps } from './types'

export const AppSelect = ({ options, value, onChange, loading = false, disabled }: IAppSelectProps) => {
  return (
    <select className="app-select" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
