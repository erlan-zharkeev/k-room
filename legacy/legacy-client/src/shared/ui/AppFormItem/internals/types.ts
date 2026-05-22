import { ReactNode } from 'react'

export interface AppFormItemProps {
  name: string
  children: ReactNode
  label?: string
  errors: string[]
  required?: boolean
}
