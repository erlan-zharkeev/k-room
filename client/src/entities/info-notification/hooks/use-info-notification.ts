import { Fragment, createElement } from 'react'

import { IEventInfoNotificationStatusUpdated } from 'common'
import { useLiveQuery } from 'dexie-react-hooks'

import { useI18n } from 'src/entities/settings'

import { DbInfoNotificationType } from 'src/shared/config'
import { db } from 'src/shared/lib'

import { INFO_NOTIFICATIONS_I18N } from './../config'

export const useInfoNotification = () => {
  const { t } = useI18n()
  const infoNotificationList =
    useLiveQuery(async () => {
      return await (db['info-notifications'].toArray() as Promise<DbInfoNotificationType[]>)
    }, []) ?? []

  const unreadInfoNotificationQuantity = infoNotificationList.filter(
    (notification) => notification.status === 'unread'
  ).length

  const isRead = (id: string) =>
    infoNotificationList.find((notification) => notification.id === id)?.status !== 'unread'

  const putInfoNotification = async (payload: DbInfoNotificationType) => await db['info-notifications'].put(payload)

  const mergeInfoNotifications = async (payload: DbInfoNotificationType[]) => {
    if (!payload.length) return

    const existingInfoNotifications = await db['info-notifications'].bulkGet(payload.map(({ id }) => id))
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

    await db['info-notifications'].bulkPut(infoNotificationsToUpsert)
  }

  const updateInfoNotificationStatus = async ({ id, status }: IEventInfoNotificationStatusUpdated) => {
    await db['info-notifications'].update(id, { status })
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
    mergeInfoNotifications,
    updateInfoNotificationStatus,
    reset
  }
}
