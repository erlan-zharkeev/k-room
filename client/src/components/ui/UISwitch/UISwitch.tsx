import { ChangeEvent, useState } from 'react'

export interface UISwitchProps {
  initValue: boolean
  onText?: string
  offText?: string
  disabled?: boolean
  id: string
  onChange?: (value: boolean, id: string) => void
}

export const UISwitch = ({ initValue, id, onText = 'On', offText = 'Off', onChange, disabled = false }: UISwitchProps) => {
  const [value, setValue] = useState(initValue)
  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.checked
    setValue(!!updatedValue)
    if (!onChange) return
    onChange(updatedValue, id)
  }
  return (
    <div className={`${disabled ? 'ui-switch ui-switch--disabled' : 'ui-switch'}`} data-checked={value}>
      <input type="checkbox" id={id} checked={value} onChange={(e) => changeHandler(e)} disabled={disabled} />
      <label htmlFor={id} />
      <p className="ui-switch__value-text">{value ? onText : offText}</p>
    </div>
  )
}
