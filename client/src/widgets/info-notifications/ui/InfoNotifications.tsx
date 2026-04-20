import './style.scss'

import { Fragment, createElement } from 'react'

import { useMarkInfoNotificationAsRead } from 'src/features/mark-info-notification-as-read'

import { INFO_NOTIFICATIONS_I18N, useInfoNotification } from 'src/entities/info-notification'

import { useI18n } from 'src/shared/preferences'
import { AppCollapseList, AppHeader } from 'src/shared/ui'

export const InfoNotification = () => {
  const { infoNotificationList, isRead } = useInfoNotification()
  const { markAsRead } = useMarkInfoNotificationAsRead()
  const { t } = useI18n()
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

  return (
    <div className="info-notifications">
      <AppHeader tag="h2" bold={false}>
        {t(INFO_NOTIFICATIONS_I18N.title)}
      </AppHeader>
      <AppCollapseList
        items={collapseInfoNotifications}
        onClickCollapseEl={(val) => {
          markAsRead(String(val))
        }}
      />
    </div>
  )
}
