import { ChangeEvent } from 'react'

export interface IAppSwitchProps {
  name: string
  value: boolean
  onText?: string
  offText?: string
  disabled?: boolean
  onChange?: (val: ChangeEvent<HTMLInputElement>) => void
}
