import './style.scss'

import { Badge } from 'antd'

import { useChatRoomSelect } from 'src/features/chat-room/select-chat-room'

import { ChatRoomPreview, useChatRooms } from 'src/entities/chat-room'
import { useSettings } from 'src/entities/settings'

import { AppScrollContainer, AppText } from 'src/shared/ui'
import { chatRoomUnreadMessagesCount } from 'src/shared/utils'

export const ChatRoomList = () => {
  const { chatRooms } = useChatRooms()
  const { selectedChatRoomId } = useSettings()
  const { selectChatRoomById } = useChatRoomSelect()

  return (
    <div className="chat-room-list">
      {chatRooms.length <= 0 && <AppText>There are no chats yet</AppText>}
      <AppScrollContainer height="100%" additionalClassName="chat-room-list__scroll-container">
        {chatRooms.map((chatRoom) => (
          <div
            className={`chat-room-list__list-item${
              chatRoom.id === selectedChatRoomId ? ' chat-room-list__list-item--selected' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation()
              selectChatRoomById(chatRoom.id)
            }}
            key={chatRoom.id}
          >
            <ChatRoomPreview room={chatRoom} isRoomSelected={chatRoom.id === selectedChatRoomId} />
            <div className="chat-rooms__controls">
              {Boolean(chatRoomUnreadMessagesCount(chatRoom)) && (
                <Badge color="var(--accent)" count={chatRoomUnreadMessagesCount(chatRoom)} offset={[-20, 0]} />
              )}
            </div>
          </div>
        ))}
      </AppScrollContainer>
    </div>
  )
}
