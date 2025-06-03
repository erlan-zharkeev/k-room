import { ReactNode, CSSProperties } from 'react'

export interface AppScrollContainerProps {
  height?: string
  additionalClassName?: string
  id?: string
  children: ReactNode
  overflowX?: CSSProperties['overflowY']
  overflowY?: CSSProperties['overflowX']
}
