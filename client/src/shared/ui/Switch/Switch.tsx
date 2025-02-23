import './style.scss'
import { ChangeEvent, useState } from 'react'

export interface SwitchProps {
  initValue: boolean
  onText?: string
  offText?: string
  disabled?: boolean
  id: string
  onChange?: (value: boolean, id: string) => void
}

export const Switch = ({ initValue, id, onText = 'On', offText = 'Off', onChange, disabled = false }: SwitchProps) => {
  const [value, setValue] = useState(initValue)
  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.checked
    setValue(!!updatedValue)
    if (!onChange) return
    onChange(updatedValue, id)
  }
  return (
    <div className={`${disabled ? 'switch switch--disabled' : 'switch'}`} data-checked={value}>
      <input type="checkbox" id={id} checked={value} onChange={(e) => changeHandler(e)} disabled={disabled} />
      <label htmlFor={id} />
      <p className="switch__value-text">{value ? onText : offText}</p>
    </div>
  )
}
