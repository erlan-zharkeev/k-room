import { AppButton } from 'src/shared/ui'
import { useChatRooms } from '../../hooks'
import { Badge } from 'antd'

export const ChatRoomsButton = () => {
  const { unreadMessagesCount } = useChatRooms()
  return (
    <Badge color="var(--accent)" count={unreadMessagesCount} size="small" offset={[-15, 10]}>
      <AppButton prefixIconName="chat" borderless />
    </Badge>
  )
}
