import { ChangeEvent, ReactNode } from 'react'

export interface UIInputProps {
  type?: 'password' | 'common'
  placeholder?: string
  size?: any
  suffix?: ReactNode
  autoComplete?: 'on' | 'off'
  value?: string
  disabled?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => Promise<void> | void
  onBlur?: () => void
}
