import './style.scss'

import { Badge } from 'antd'

import { useContentTabSelect } from 'src/features/content-tab/select-content-tab'

import { AppButton } from 'src/shared/ui'

import { useUnreadInfoNotification } from '../../hooks/use-unread-info-notification'

export const InfoMessageBtn = () => {
  const { unreadInfoNotificationQuantity } = useUnreadInfoNotification()
  const { selectContentTab } = useContentTabSelect()

  return (
    <Badge color={'var(--error)'} count={unreadInfoNotificationQuantity} offset={[-5, 2]}>
      <AppButton prefixIconName="notification" borderless onClick={() => selectContentTab('info')} />
    </Badge>
  )
}
