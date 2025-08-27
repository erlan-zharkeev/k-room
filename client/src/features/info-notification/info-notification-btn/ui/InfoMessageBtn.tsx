import './style.scss'

import { Badge } from 'antd'

import { useContentTabSelect } from 'src/features/content-tab'

import { useInfoNotification } from 'src/entities/info-notification'

import { AppButton } from 'src/shared/ui'

export const InfoMessageBtn = () => {
  const { unreadInfoNotificationQuantity } = useInfoNotification()
  const { selectContentTab } = useContentTabSelect()

  return (
    <Badge color={'var(--error)'} count={unreadInfoNotificationQuantity} offset={[-5, 2]}>
      <AppButton prefixIconName="notification" borderless onClick={() => selectContentTab('info')} />
    </Badge>
  )
}
