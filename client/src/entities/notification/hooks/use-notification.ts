import { notification as antdNotification } from 'antd'
import { IMessage } from 'common-types'

import { useSettings } from 'src/entities/settings'
import { useUser } from 'src/entities/user'

import { AppLogoIcon } from 'src/shared/assets'

import type { IAppNotification, NotificationType } from '../types'

import { getNotificationIcon } from './../lib'

const ERROR_NOTIFICATION_DURATION_IN_SEC = 10

export const useNotification = () => {
  const { isAuth } = useUser()

  const { showNotification } = useSettings()

  const basicNotificationData: IAppNotification = {
    key: '',
    message: '',
    description: '',
    messageType: 'info',
    duration: 8,
    placement: 'top',
    icon: getNotificationIcon('info')
  }

  const getNotification = (notification: IAppNotification) => {
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

    const notificationData: IAppNotification = {
      ...basicNotificationData,
      ...notification,
      messageType,
      placement,
      duration,
      icon: getNotificationIcon(messageType)
    }

    const open = () => {
      if (showNotification || !isAuth) antdNotification[messageType](notificationData)
    }

    const close = (id: string) => antdNotification.destroy(id)

    return { open, close, key }
  }

  const openBrowserNotification = (payload: { message: Omit<IMessage, 'id' | 'authorId'>; icon?: string }) => {
    if (!showNotification) return
    const { message, icon = AppLogoIcon } = payload
    void new Notification(message.authorName, { body: message.body, icon })
  }

  return {
    getNotification,
    openBrowserNotification
  }
}
