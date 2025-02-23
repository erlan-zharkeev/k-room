import './style.scss'
import { Input as AntdInput } from 'antd'
import { SizeType } from 'antd/lib/config-provider/SizeContext'
import { ChangeEvent, ReactNode } from 'react'
import { modifiersHandler } from 'src/shared/utils'

export interface InputProps {
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
  { name: 'common', component: AntdInput },
  { name: 'password', component: AntdInput.Password }
]

export const Input = ({ type, placeholder, size, value, suffix, autoComplete, disabled, onChange }: InputProps) => {
  const inputType = type ?? 'common'
  const InputComponent = inputTypes.find((input) => input.name === inputType)?.component
  const className = modifiersHandler({ rootClass: 'input', modifiers: [size] })
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
