import { ChangeEvent, ReactNode } from 'react'

export default interface UIInputProps {
  type?: 'password' | 'common'
  placeholder?: string
  size?: any
  suffix?: ReactNode
  autoComplete?: 'on' | 'off'
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => Promise<void>
  onBlur?: () => void
}
