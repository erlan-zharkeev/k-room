import { notification as antdNotification } from 'antd'
import { IMessage } from 'common'

import { ERROR_NOTIFICATION_DURATION_IN_SEC, IAppNotification, NotificationType } from 'src/entities/notification'
import { getNotificationIcon } from 'src/entities/notification/lib'
import { useSettings } from 'src/entities/settings'
import { useSystem } from 'src/entities/system'

import { AppLogoIcon } from 'src/shared/ui'

export const useNotification = () => {
  const { showNotification } = useSettings()
  const { auth } = useSystem()

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
    const placement = notification.placement ?? (isInfo ? 'bottomRight' : 'top')
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
      if (showNotification || ['unauthorized', 'loading'].includes(auth)) {
        antdNotification[messageType](notificationData)
      }
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
