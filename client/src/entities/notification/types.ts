import { ReactNode } from 'react'

import { useNotification } from './hooks'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export type UseNotification = ReturnType<typeof useNotification>

export interface IAppNotification {
  key?: string
  message: string | '' | ReactNode
  description?: string
  messageType?: NotificationType
  duration?: number
  placement?: 'top' | 'bottom' | 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft'
  icon?: JSX.Element,
  actions?: JSX.Element
}
