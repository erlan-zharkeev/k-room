import './style.scss'

import { UnknownCallbackType } from 'common'

import { RoomTypingContact } from 'src/widgets/chat-room'

import { ChatRoomPreview, isRoomPrivate } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useLiveMediaUrl } from 'src/entities/media-file'

import { FChatRoomType } from 'src/shared/config'
import { AppButton } from 'src/shared/ui'

const ChatRoomHeaderPreview = ({ room, onClick }: { room: FChatRoomType; onClick: UnknownCallbackType }) => {
  const { contacts } = useContact()
  const avatar = useLiveMediaUrl(room.avatarId)
  const privateRoom = isRoomPrivate(room)
  const privateContact = contacts.find((contact) => contact.id === room.users[0])

  return (
    <ChatRoomPreview
      avatar={avatar}
      title={room.chatName || privateContact?.username || ''}
      online={privateContact?.online}
      isPrivate={privateRoom}
      headerMode
      titleSize="large"
      onClick={onClick}
    />
  )
}

export const ChatRoomHeader = ({
  room,
  onClickChatRoomSettings,
  onResetChatRoomSelection
}: {
  room: FChatRoomType
  onClickChatRoomSettings: UnknownCallbackType
  onResetChatRoomSelection: UnknownCallbackType
}) => {
  return (
    <div className="chat-room-header">
      <div className="chat-room-header__mobile-back-button">
        <AppButton prefixIconName="arrow-left" onClick={onResetChatRoomSelection} borderless />
      </div>
      <div className="chat-room-header__info">
        <ChatRoomHeaderPreview room={room} onClick={onClickChatRoomSettings} />
        <RoomTypingContact room={room} />
      </div>
    </div>
  )
}
