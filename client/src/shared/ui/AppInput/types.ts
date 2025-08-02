import { ChangeEvent, ForwardedRef, ReactNode } from 'react'

export interface IAppInputProps {
  name: string
  value?: string
  nativeType?: React.HTMLInputTypeAttribute
  placeholder?: string
  disabled?: boolean
  autoComplete?: 'on' | 'off'
  onChange?: (e: ChangeEvent<HTMLInputElement>) => Promise<void> | void
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => Promise<void> | void
  showClearButton?: boolean
  prefixSlot?: ReactNode
  loading?: boolean
  ref?: ForwardedRef<HTMLInputElement | null>
}
