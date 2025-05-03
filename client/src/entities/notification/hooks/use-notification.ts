import { ReactNode } from 'react'

import { notification as antdNotification } from 'antd'
import { IMessage } from 'common-types'

import { useSettings } from 'src/entities/settings'
import { useUser } from 'src/entities/user'

import { AppLogoIcon } from 'src/shared/assets'

import { ClientNotificationMessage, NotificationType } from '../types'

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
  duration: 8,
  placement: 'top'
}

export type UseNotification = ReturnType<typeof useNotification>

const ERROR_NOTIFICATION_DURATION_IN_SEC = 10

export const useNotification = () => {
  const { isAuth } = useUser()

  const { showNotification } = useSettings()

  const getNotification = (notification: Notification) => {
    const messageType = notification.messageType ?? (basicNotificationData.messageType as NotificationType)
    const isError = messageType === 'error'
    const isInfo = messageType === 'info'
    const placement = isInfo ? 'bottomRight' : 'top'
    const key = notification.key === undefined ? '' : notification.key

    let duration: number | undefined = basicNotificationData.duration
    if (isError) {
      duration = ERROR_NOTIFICATION_DURATION_IN_SEC
    }
    if (notification.duration !== undefined) {
      duration = notification.duration
    }

    const notificationData: Notification = {
      ...basicNotificationData,
      ...notification,
      messageType,
      placement,
      duration
    }

    const open = () => {
      if (showNotification || !isAuth) antdNotification[messageType](notificationData)
    }

    const close = (id: string) => antdNotification.destroy(id)

    return { open, close, key }
  }

  const openBrowserNotification = (payload: { message: IMessage; icon?: string }) => {
    const { message, icon = AppLogoIcon } = payload
    void new Notification(message.authorName, { body: message.body, icon })
  }

  return {
    getNotification,
    openBrowserNotification
  }
}
