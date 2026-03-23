import { Badge } from 'antd'

import { useChatRoom } from 'src/entities/chat-room'

import { AppButton } from 'src/shared/ui'

export const ChatRoomsButton = () => {
  const { unreadMessageQuantity } = useChatRoom()

  return (
    <Badge color="var(--accent)" count={unreadMessageQuantity} size="small" offset={['-8px', '5px']}>
      <AppButton prefixIconName="chat" borderless />
    </Badge>
  )
}
