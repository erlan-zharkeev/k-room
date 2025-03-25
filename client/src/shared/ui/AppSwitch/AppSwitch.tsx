import './style.scss'
import { ChangeEvent, useState } from 'react'

export interface AppSwitchProps {
  name: string
  value: boolean
  onText?: string
  offText?: string
  disabled?: boolean
  onChange?: (val: ChangeEvent<HTMLInputElement>) => void
  children?: React.ReactNode
}

export const AppSwitch = ({
  name,
  value,
  onText = 'On',
  offText = 'Off',
  onChange,
  disabled = false,
  children
}: AppSwitchProps) => {
  const [val, setVal] = useState(value)
  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.checked
    setVal(!!updatedValue)
    if (!onChange) return
    onChange(e)
  }
  return (
    <>
      <div className={`${disabled ? 'switch switch--disabled' : 'switch'}`} data-checked={val}>
        <input
          type="checkbox"
          id={name}
          checked={val}
          onChange={(e) => changeHandler(e)}
          disabled={disabled}
          name={name}
        />
        <label htmlFor={name} />
        <p className="switch__value-text">{val ? onText : offText}</p>
      </div>
      {children}
    </>
  )
}
