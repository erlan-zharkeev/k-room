import './style.scss'

import { UnknownCallback } from 'common'

import { ChatRoomPreview, isRoomPrivate } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useLiveMediaUrl } from 'src/entities/media-file'

import { FChatRoom } from 'src/shared/config'
import { AppButton } from 'src/shared/ui'

import { RoomTypingContact } from '../RoomTypingContact/RoomTypingContact'

const ChatRoomHeaderPreview = ({ room, onClick }: { room: FChatRoom; onClick: UnknownCallback }) => {
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
  room: FChatRoom
  onClickChatRoomSettings: UnknownCallback
  onResetChatRoomSelection: UnknownCallback
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
