import { Fragment, createElement } from 'react'

import { IEventInfoNotificationStatusUpdated } from 'common'

import { useI18n } from 'src/entities/settings'

import { DbInfoNotificationType } from 'src/shared/config'
import { db, dexieCollectionStore } from 'src/shared/lib'

import { INFO_NOTIFICATIONS_I18N } from './../config'

const infoNotificationStore = dexieCollectionStore<DbInfoNotificationType>(db['info-notifications'])

export const useInfoNotification = () => {
  const { t } = useI18n()
  const infoNotificationList = infoNotificationStore.use()

  const unreadQuantity = infoNotificationList.filter((notification) => notification.status === 'unread').length

  const isRead = (id: string) =>
    infoNotificationList.find((notification) => notification.id === id)?.status !== 'unread'

  const merge = async (payload: DbInfoNotificationType[]) => {
    if (!payload.length) return

    const existingInfoNotifications = await infoNotificationStore.bulkGet(payload.map(({ id }) => id))
    const infoNotificationsToUpsert = payload.filter((notification, index) => {
      const existingInfoNotification = existingInfoNotifications[index]

      if (!existingInfoNotification) return true

      return (
        existingInfoNotification.status !== notification.status ||
        existingInfoNotification.isActive !== notification.isActive ||
        existingInfoNotification.updatedAt !== notification.updatedAt
      )
    })

    if (!infoNotificationsToUpsert.length) return

    await infoNotificationStore.bulkPut(infoNotificationsToUpsert)
  }

  const updateStatus = ({ id, status }: IEventInfoNotificationStatusUpdated) => {
    return infoNotificationStore.update(id, { status })
  }

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
    unreadQuantity,
    collapseInfoNotifications,
    isRead,
    put: (payload: DbInfoNotificationType) => infoNotificationStore.put(payload),
    merge,
    updateStatus,
    reset: () => infoNotificationStore.reset()
  }
}
