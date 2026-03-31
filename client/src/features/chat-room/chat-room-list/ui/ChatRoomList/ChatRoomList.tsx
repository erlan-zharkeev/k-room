import './style.scss'

import { Badge } from 'antd'

import { CHAT_ROOM_LIST_I18N, useChatRoomSelect } from 'src/features/chat-room'

import { ChatRoomPreview, useChatRoom } from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'
import { useSettings } from 'src/entities/settings'
import { useI18n } from 'src/entities/settings'

import { useAnimatedList } from 'src/shared/lib'
import { AppScrollContainer, AppText } from 'src/shared/ui'
import { chatRoomUnreadMessagesCount, createClassNameWithModifiers } from 'src/shared/utils'

export const ChatRoomList = () => {
  const { chatRooms, hasChatRooms } = useChatRoom()
  const { messages } = useMessage()
  const { selectedChatRoomId } = useSettings()
  const { selectChatRoomById } = useChatRoomSelect()
  const { t } = useI18n()
  const { renderedItems } = useAnimatedList(chatRooms ?? [], 'id')

  return (
    <div className="chat-room-list">
      {!hasChatRooms && <AppText>{t(CHAT_ROOM_LIST_I18N.empty)}</AppText>}
      <AppScrollContainer height="100%" additionalClassName="chat-room-list__scroll-container">
        {renderedItems.map(({ item: chatRoom, key, state }) => (
          <div
            className={createClassNameWithModifiers({
              rootClass: 'chat-room-list__list-item animated-list__item',
              modifiers: [chatRoom.id === selectedChatRoomId && 'selected', state],
              additionalClassName: `animated-list__item--${state}`
            })}
            onClick={(e) => {
              e.stopPropagation()
              selectChatRoomById(chatRoom.id)
            }}
            key={key}
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
