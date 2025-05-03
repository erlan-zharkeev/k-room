import { Badge } from 'antd'

import { AppButton } from 'src/shared/ui'

import { useChatRooms } from '../../hooks'

export const ChatRoomsButton = () => {
  const { unreadMessageQuantity } = useChatRooms()
  return (
    <Badge color="var(--accent)" count={unreadMessageQuantity} size="small" offset={[-15, 10]}>
      <AppButton prefixIconName="chat" borderless />
    </Badge>
  )
}
