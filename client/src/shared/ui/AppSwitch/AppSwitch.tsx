import './style.scss'

import { ChangeEvent, useState } from 'react'

import type { IAppSwitchProps } from 'src/shared/ui/AppSwitch/config'
import { createClassNameWithModifiers } from 'src/shared/utils'

const rootClass = 'app-switch'

export const AppSwitch = ({
  name,
  value,
  onText = 'On',
  offText = 'Off',
  onChange,
  disabled = false
}: IAppSwitchProps) => {
  const [val, setVal] = useState(value)
  const [focused, setFocused] = useState(false)

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.checked
    setVal(!!updatedValue)
    if (!onChange) return
    onChange(e)
  }

  const className = createClassNameWithModifiers({
    rootClass,
    modifiers: [disabled && 'disabled', focused && 'focused']
  })

  return (
    <div className={className} data-checked={val}>
      <input
        type="checkbox"
        id={name}
        checked={val}
        onChange={(e) => changeHandler(e)}
        disabled={disabled}
        name={name}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false)
        }}
      />
      <label htmlFor={name} />
      <div className="app-switch__value-text">{val ? onText : offText}</div>
    </div>
  )
}
