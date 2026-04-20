import './style.scss'

import { Badge } from 'antd'

import { CHAT_ROOM_LIST_I18N } from 'src/features/chat-room-list'
import { useChatRoomSelect } from 'src/features/select-chat-room'

import { ChatRoomPreview, isRoomPrivate, useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useLiveMediaUrl } from 'src/entities/media-file'
import { useMessage } from 'src/entities/message'

import { FChatRoomType } from 'src/shared/config'
import { useAnimatedList, chatRoomUnreadMessagesCount, createClassNameWithModifiers } from 'src/shared/lib'
import { useSettings, useI18n } from 'src/shared/preferences'
import { AppScrollContainer, AppText } from 'src/shared/ui'

const ChatRoomListItemPreview = ({ room, isRoomSelected }: { room: FChatRoomType; isRoomSelected: boolean }) => {
  const { contacts } = useContact()
  const { getById } = useMessage()
  const avatar = useLiveMediaUrl(room.avatarId)
  const privateRoom = isRoomPrivate(room)
  const privateContact = contacts.find((contact) => contact.id === room.users[0])
  const title = room.chatName || privateContact?.username || ''
  const lastMessageBody = room.lastMessageId ? getById(room.lastMessageId)?.body ?? '' : ''

  return (
    <ChatRoomPreview
      avatar={avatar}
      title={title}
      description={lastMessageBody}
      online={privateContact?.online}
      isPrivate={privateRoom}
      isRoomSelected={isRoomSelected}
    />
  )
}

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
          <button
            type="button"
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
            <ChatRoomListItemPreview room={chatRoom} isRoomSelected={chatRoom.id === selectedChatRoomId} />
            {Boolean(chatRoomUnreadMessagesCount(chatRoom, messages)) && (
              <Badge color="var(--accent)" count={chatRoomUnreadMessagesCount(chatRoom, messages)} offset={[-5, 0]} />
            )}
          </button>
        ))}
      </AppScrollContainer>
    </div>
  )
}
