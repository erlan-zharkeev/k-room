import { Input } from 'antd'
import { SizeType } from 'antd/lib/config-provider/SizeContext'
import { ChangeEvent, ReactNode } from 'react'
import { modifiersHandler } from 'src/utils'

export interface UIInputProps {
  type?: 'password' | 'common'
  placeholder?: string
  size?: SizeType
  suffix?: ReactNode
  autoComplete?: 'on' | 'off'
  disabled?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => Promise<void> | void
  onBlur?: () => void
  value?: string
}

const inputTypes = [
  { name: 'common', component: Input },
  { name: 'password', component: Input.Password }
]

export const UIInput = ({ type, placeholder, size, value, suffix, autoComplete, disabled, onChange }: UIInputProps) => {
  const inputType = type ?? 'common'
  const InputComponent = inputTypes.find((input) => input.name === inputType)?.component
  const className = modifiersHandler({ rootClass: 'ui-input', modifiers: [size] })
  return (
    <div className={className}>
      {InputComponent && (
        <InputComponent
          disabled={disabled}
          size={size}
          autoComplete={autoComplete}
          placeholder={placeholder}
          suffix={suffix}
          onChange={onChange}
          value={value}
        />
      )}
    </div>
  )
}
