import './style.scss'

import { Badge } from 'antd'

import { useChatRoomSelect } from 'src/features/chat-room'

import { ChatRoomPreview, useChatRoom } from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'
import { useSettings } from 'src/entities/settings'

import { AppScrollContainer, AppText } from 'src/shared/ui'
import { chatRoomUnreadMessagesCount, createClassNameWithModifiers } from 'src/shared/utils'

export const ChatRoomList = () => {
  const { chatRooms } = useChatRoom()
  const { messages } = useMessage()
  const { selectedChatRoomId } = useSettings()
  const { selectChatRoomById } = useChatRoomSelect()

  return (
    <div className="chat-room-list">
      {chatRooms.length <= 0 && <AppText>There are no chats yet</AppText>}
      <AppScrollContainer height="100%" additionalClassName="chat-room-list__scroll-container">
        {chatRooms.map((chatRoom) => (
          <div
            className={createClassNameWithModifiers({
              rootClass: 'chat-room-list__list-item',
              modifiers: [chatRoom.id === selectedChatRoomId && 'selected']
            })}
            onClick={(e) => {
              e.stopPropagation()
              selectChatRoomById(chatRoom.id)
            }}
            key={chatRoom.id}
          >
            <ChatRoomPreview room={chatRoom} isRoomSelected={chatRoom.id === selectedChatRoomId} />
            {Boolean(chatRoomUnreadMessagesCount(chatRoom, messages)) && (
              <Badge color="var(--accent)" count={chatRoomUnreadMessagesCount(chatRoom, messages)} offset={[-5, 0]} />
            )}
          </div>
        ))}
      </AppScrollContainer>
    </div>
  )
}
