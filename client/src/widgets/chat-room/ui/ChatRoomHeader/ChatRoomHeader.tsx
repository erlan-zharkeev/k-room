import './style.scss'

import type { UnknownCallbackType } from 'common'

import { RoomTypingContact } from 'src/widgets/chat-room'

import { ChatRoomPreview } from 'src/entities/chat-room'

import { FChatRoomType } from 'src/shared/config'
import { AppButton } from 'src/shared/ui'

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
        <ChatRoomPreview room={room} headerMode onClick={onClickChatRoomSettings} titleSize="large" />
        <RoomTypingContact room={room} />
      </div>
    </div>
  )
}
