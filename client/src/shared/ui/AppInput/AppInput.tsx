import './style.scss'
import { ChangeEvent, useMemo, useState, forwardRef, ForwardedRef } from 'react'

import { AppButton } from 'src/shared/ui'
import { createClassNameWithModifiers } from 'src/shared/utils'

import type { IAppInputProps } from './config'

const rootClass = 'app-input'

export const AppInput = forwardRef<HTMLInputElement, IAppInputProps>(
  (
    {
      name,
      nativeType = 'text',
      placeholder,
      value = '',
      disabled,
      autoComplete = 'off',
      onChange,
      onBlur,
      showClearButton = false,
      prefixSlot = undefined,
      loading = false
    }: IAppInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [focused, setFocused] = useState(false)
    const [showPasswordText, setShowPasswordText] = useState(false)

    const className = createClassNameWithModifiers({
      rootClass,
      modifiers: [nativeType, disabled && 'disabled', focused && 'focused', showClearButton && 'with-clear-btn']
    })

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
            ref={ref}
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
        {showClearButton && !loading && (
          <div className="app-input__suffix-slot">
            <AppButton prefixIconName="cross" borderless onClick={clearHandler} />
          </div>
        )}
        {loading && (
          <div className="app-input__suffix-slot">
            <AppButton prefixIconName="loader" borderless color="accent-color" />
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
)

AppInput.displayName = 'AppInput'
