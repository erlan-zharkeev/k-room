import './info-notification-button.scss'

import { Badge } from 'antd'

import { useInfoNotification } from 'src/entities/info-notification'

import { useContentTabSelect } from 'src/shared/preferences'
import { AppButton } from 'src/shared/ui'

export const InfoNotificationButton = () => {
  const { unreadQuantity } = useInfoNotification()
  const { selectContentTab } = useContentTabSelect()

  return (
    <Badge className="info-notification-btn" color={'var(--error)'} count={unreadQuantity} offset={[-5, 2]}>
      <AppButton prefixIconName="notification" borderless onClick={() => selectContentTab('info')} />
    </Badge>
  )
}
