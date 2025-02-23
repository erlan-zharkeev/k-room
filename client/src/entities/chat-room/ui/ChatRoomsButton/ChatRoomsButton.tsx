import { Button } from 'src/shared/ui'
import { useChatRooms } from '../../hooks'
import { Badge } from 'antd'

export const ChatRoomsButton = () => {
  const { unreadMessagesCount } = useChatRooms()
  return (
    <Badge color="var(--accent)" count={unreadMessagesCount} size="small" offset={[-15, 10]}>
      <Button type="radio" value="chat-rooms" iconName="chats" />
    </Badge>
  )
}
