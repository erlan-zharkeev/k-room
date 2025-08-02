import { ReactNode, CSSProperties } from 'react'

export interface IAppScrollContainerProps {
  height?: string
  additionalClassName?: string
  id?: string
  children: ReactNode
  overflowX?: CSSProperties['overflowY']
  overflowY?: CSSProperties['overflowX']
}
