import { Fragment, createElement } from 'react'

import { useLiveQuery } from 'dexie-react-hooks'

import { INFO_NOTIFICATIONS_I18N } from 'src/entities/info-notification'
import { useI18n } from 'src/entities/settings'
import { useUser } from 'src/entities/user'

import { DbInfoNotificationType } from 'src/shared/config'
import { db } from 'src/shared/lib'

export const useInfoNotification = () => {
  const { infoNotifications } = useUser()
  const { t } = useI18n()
  const infoNotificationList =
    useLiveQuery(async () => {
      return await (db['info-notifications'].toArray() as Promise<DbInfoNotificationType[]>)
    }, []) ?? []

  const unreadInfoNotificationQuantity = infoNotificationList.filter(
    (notification) => infoNotifications[notification.id] === 'unread'
  ).length

  const isRead = (id: string) => infoNotifications[id] !== 'unread'

  const putInfoNotification = async (payload: DbInfoNotificationType) => await db['info-notifications'].put(payload)

  const bulkPutInfoNotifications = async (payload: DbInfoNotificationType[]) => {
    await db['info-notifications'].bulkPut(payload)
  }

  const reset = () => db['info-notifications'].clear()

  const collapseInfoNotifications = infoNotificationList.map((notification) => {
    const paragraphs = t(notification.content)

    return {
      id: notification.id,
      title: t(notification.title),
      content: () =>
        createElement(
          Fragment,
          null,
          ...paragraphs.map((paragraph) => createElement('p', { className: 'app-text', key: paragraph }, paragraph))
        ),
      badgeName: !isRead(notification.id) ? t(INFO_NOTIFICATIONS_I18N.unreadBadge) : undefined
    }
  })

  return {
    infoNotificationList,
    unreadInfoNotificationQuantity,
    collapseInfoNotifications,
    isRead,
    putInfoNotification,
    bulkPutInfoNotifications,
    reset
  }
}
