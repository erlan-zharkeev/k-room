import './style.scss'
import { ChangeEvent, ReactNode, useMemo, useState } from 'react'

import { createClassNameWithModifiers } from 'src/shared/utils'

import { AppButton } from '../AppButton/AppButton'

export interface AppInputProps {
  name: string
  value: string
  nativeType?: React.HTMLInputTypeAttribute
  placeholder?: string
  disabled?: boolean
  autoComplete?: 'on' | 'off'
  onChange?: (e: ChangeEvent<HTMLInputElement>) => Promise<void> | void
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => Promise<void> | void
  showClearButton?: boolean
  prefixSlot?: ReactNode
}

const rootClass = 'app-input'

export const AppInput = ({
  name,
  nativeType = 'text',
  placeholder,
  value = '',
  disabled,
  autoComplete = 'off',
  onChange,
  onBlur,
  showClearButton = false,
  prefixSlot = undefined
}: AppInputProps) => {
  const [focused, setFocused] = useState(false)
  const className = createClassNameWithModifiers({
    rootClass,
    modifiers: [nativeType, disabled && 'disabled', focused && 'focused', showClearButton && 'with-clear-btn']
  })
  const [showPasswordText, setShowPasswordText] = useState(false)

  const currentType = useMemo(() => {
    if (nativeType !== 'password') return nativeType
    return showPasswordText ? 'text' : 'password'
  }, [nativeType, showPasswordText])

  const clearHandler = () => {
    const syntheticEvent = {
      target: {
        name,
        value: ''
      }
    } as ChangeEvent<HTMLInputElement>
    onChange?.(syntheticEvent)
  }

  return (
    <div className={className}>
      {prefixSlot && <div className="app-input__prefix-icon">{prefixSlot}</div>}
      <div className="app-input__input-wrapper">
        <input
          name={name}
          value={value}
          type={currentType}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
          onFocus={() => setFocused(true)}
          autoComplete={autoComplete}
        />
      </div>
      {showClearButton && (
        <div className="app-input__clear-btn">
          <AppButton prefixIconName="cross" borderless onClick={clearHandler} />
        </div>
      )}
      {nativeType === 'password' && (
        <div className="app-input__show-pass-btn">
          <AppButton
            prefixIconName={showPasswordText ? 'eye-blocked' : 'eye'}
            iconSize="xs"
            onClick={() => setShowPasswordText(!showPasswordText)}
            borderless
          />
        </div>
      )}
    </div>
  )
}
