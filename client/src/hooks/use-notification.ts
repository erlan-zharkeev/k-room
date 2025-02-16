import { clientConstants } from 'src/client-constants'
import { notification as antdNotification } from 'antd'
import { useTypedSelector } from './use-typed-selector'
import { ReactNode } from 'react'
import { ClientNotificationMessage, NotificationType } from 'src/@types'

interface Notification {
  key?: string
  message: ClientNotificationMessage | '' | ReactNode
  description?: string
  messageType?: NotificationType
  duration?: number
  placement?: 'top' | 'bottom' | 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft'
}

const basicNotificationData: Notification = {
  key: '',
  message: '',
  description: '',
  messageType: 'info',
  duration: 3,
  placement: 'top'
}

export type UseNotification = ReturnType<typeof useNotification>

export const useNotification = () => {
  const { ableToShowNotification } = useTypedSelector((state) => state.persist.settings)
  const getNotification = (notification: Notification) => {
    const messageType = notification.messageType ?? (basicNotificationData.messageType as NotificationType)
    const isError = messageType === 'error'
    const isInfo = messageType === 'info'
    const placement = isInfo ? 'bottomRight' : 'top'
    const key = notification.key === undefined ? '' : notification.key
    const duration = isError
      ? clientConstants.errorNotificationDuration
      : notification.duration !== undefined
      ? notification.duration
      : basicNotificationData.duration

    const notificationData: Notification = {
      ...basicNotificationData,
      ...notification,
      messageType,
      placement,
      duration
    }

    const open = () => {
      if (ableToShowNotification) antdNotification[messageType](notificationData)
    }

    const close = (id: string) => antdNotification.close(id)

    return { open, close, key }
  }

  return {
    getNotification
  }
}
