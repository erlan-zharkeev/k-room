import './style.scss'

import { useMarkInfoNotificationAsRead } from 'src/features/info-notification'

import { INFO_NOTIFICATIONS_I18N, useInfoNotification } from 'src/entities/info-notification'
import { useI18n } from 'src/entities/settings'

import { AppCollapseList, AppHeader } from 'src/shared/ui'

export const InfoNotification = () => {
  const { collapseInfoNotifications } = useInfoNotification()
  const { markAsRead } = useMarkInfoNotificationAsRead()
  const { t } = useI18n()

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
