import { ReactNode } from 'react'

export interface IAppFormItemProps {
  name: string
  children: ReactNode
  label?: string
  errors: string[]
  required?: boolean
}
