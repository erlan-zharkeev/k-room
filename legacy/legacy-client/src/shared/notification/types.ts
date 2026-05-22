import { ReactNode } from 'react'

import { useNotification } from './hooks/use-notification'

export type Notification = 'success' | 'error' | 'info' | 'warning'

export type UseNotification = ReturnType<typeof useNotification>

export interface AppNotification {
  key?: string
  message: string | '' | ReactNode
  description?: string
  messageType?: Notification
  duration?: number
  placement?: 'top' | 'bottom' | 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft'
  icon?: JSX.Element
  actions?: JSX.Element
}
