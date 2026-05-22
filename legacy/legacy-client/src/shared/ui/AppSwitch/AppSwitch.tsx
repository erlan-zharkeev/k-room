import './style.scss'

import { ChangeEvent, useState } from 'react'

import { createClassNameWithModifiers } from 'src/shared/lib'

import { AppSwitchProps } from './internals/types'

export const AppSwitch = ({
  name,
  value,
  onText = 'On',
  offText = 'Off',
  onChange,
  disabled = false
}: AppSwitchProps) => {
  const [val, setVal] = useState(value)
  const [focused, setFocused] = useState(false)

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.checked
    setVal(!!updatedValue)
    if (!onChange) return
    onChange(e)
  }

  const className = createClassNameWithModifiers({
    rootClass: 'app-switch',
    modifiers: [disabled && 'disabled', focused && 'focused']
  })

  return (
    <div className={className} data-checked={val}>
      <input
        type="checkbox"
        id={name}
        aria-label={name}
        checked={val}
        onChange={(e) => changeHandler(e)}
        disabled={disabled}
        name={name}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false)
        }}
      />
      <label htmlFor={name}>
        <span className="app-switch__label-text">{name}</span>
      </label>
      <div className="app-switch__value-text">{val ? onText : offText}</div>
    </div>
  )
}
