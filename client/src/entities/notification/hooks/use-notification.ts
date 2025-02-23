import { notification as antdNotification } from 'antd'
import { ReactNode } from 'react'
import { ClientNotificationMessage, NotificationType } from '../types'
import { useTypedSelector } from 'src/shared/lib'

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

const ERROR_NOTIFICATION_DURATION_IN_SEC = 5

export const useNotification = () => {
  const { ableToShowNotification } = useTypedSelector((state) => state.persist.settings)
  const getNotification = (notification: Notification) => {
    const messageType = notification.messageType ?? (basicNotificationData.messageType as NotificationType)
    const isError = messageType === 'error'
    const isInfo = messageType === 'info'
    const placement = isInfo ? 'bottomRight' : 'top'
    const key = notification.key === undefined ? '' : notification.key
    const duration = isError
      ? ERROR_NOTIFICATION_DURATION_IN_SEC
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
