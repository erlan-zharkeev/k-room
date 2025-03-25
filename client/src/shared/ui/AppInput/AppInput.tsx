import './style.scss'
import { ChangeEvent, useMemo, useState } from 'react'
import { createClassNameWithModifiers } from 'src/shared/utils'
import { AppButton } from '../AppButton/AppButton'

export interface AppInputProps {
  name: string
  value: string
  type?: 'password' | 'text'
  placeholder?: string
  disabled?: boolean
  autoComplete?: 'on' | 'off'
  onChange?: (e: ChangeEvent<HTMLInputElement>) => Promise<void> | void
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => Promise<void> | void
}

const rootClass = 'app-input'

export const AppInput = ({
  name,
  type = 'text',
  placeholder,
  value = '',
  disabled,
  autoComplete = 'off',
  onChange,
  onBlur
}: AppInputProps) => {
  const className = createClassNameWithModifiers({ rootClass, modifiers: [type] })
  const [showPasswordText, setShowPasswordText] = useState(false)

  const currentType = useMemo(() => {
    if (type === 'text') return 'text'
    return showPasswordText ? 'text' : 'password'
  }, [type, showPasswordText])

  return (
    <div className={className}>
      <input
        name={name}
        value={value}
        type={currentType}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
      />
      {type === 'password' && (
        <AppButton
          prefixIconName={showPasswordText ? 'eye-blocked' : 'eye'}
          iconSize="xs"
          onClick={() => setShowPasswordText(!showPasswordText)}
          borderless
        />
      )}
    </div>
  )
}
