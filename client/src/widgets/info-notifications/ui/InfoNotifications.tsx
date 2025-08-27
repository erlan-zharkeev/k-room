import './style.scss'

import { useMarkInfoNotificationAsRead } from 'src/features/info-notification'

import { useInfoNotification } from 'src/entities/info-notification'

import { AppCollapseList, AppHeader } from 'src/shared/ui'

export const InfoNotification = () => {
  const { collapseInfoNotifications } = useInfoNotification()
  const { markAsRead } = useMarkInfoNotificationAsRead()

  return (
    <div className="info-notifications">
      <AppHeader tag="h2" bold={false}>
        Info notification
      </AppHeader>
      <AppCollapseList
        items={collapseInfoNotifications}
        onClickCollapseEl={async (val) => {
          markAsRead(Number(val))
        }}
      />
    </div>
  )
}
