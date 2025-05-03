import './style.scss'

import { useInfoNotification } from 'src/features/info-notification'

import { AppCollapseList, AppHeader } from 'src/shared/ui'

export const InfoNotification = () => {
  const { collapseInfoNotifications, infoNotificationClickHandler } = useInfoNotification()

  return (
    <div className="info-notifications">
      <AppHeader tag="h2" bold={false}>
        Info notification
      </AppHeader>
      <AppCollapseList items={collapseInfoNotifications} onClickCollapseEl={infoNotificationClickHandler} />
    </div>
  )
}
