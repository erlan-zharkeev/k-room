import type { ReactNode } from 'react'

import type { IButtonProps } from '../..'

export interface IAppModalAction {
  text?: string
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  color?: IButtonProps['color']
  htmltype?: IButtonProps['htmltype']
}

export interface IAppModalProps {
  title?: ReactNode
  open: boolean
  onClose: () => void
  children: ReactNode
  headerExtra?: ReactNode
  className?: string
  okAction?: IAppModalAction
  cancelAction?: IAppModalAction
  actions?: ReactNode
}
