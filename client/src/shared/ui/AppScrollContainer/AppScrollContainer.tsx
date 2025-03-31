import { ReactNode } from 'react'
import './style.scss'

interface AppScrollContainerProps {
  height?: string
  children: ReactNode
}

export const AppScrollContainer = ({ height = '300px', children }: AppScrollContainerProps) => {
  return (
    <div className="app-scroll-container" style={{ maxHeight: height }}>
      {children}
    </div>
  )
}
