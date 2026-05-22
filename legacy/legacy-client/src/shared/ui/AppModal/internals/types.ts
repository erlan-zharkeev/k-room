import { ReactNode } from 'react'

import { ButtonProps } from 'src/shared/ui/AppButton/internals/types'

export interface AppModalAction {
  text?: string
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  color?: ButtonProps['color']
  htmltype?: ButtonProps['htmltype']
}

export interface AppModalProps {
  title?: ReactNode
  open: boolean
  onClose: () => void
  children: ReactNode
  headerExtra?: ReactNode
  className?: string
  okAction?: AppModalAction
  cancelAction?: AppModalAction
  actions?: ReactNode
}
