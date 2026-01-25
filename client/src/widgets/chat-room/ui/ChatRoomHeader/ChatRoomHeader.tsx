import './style.scss'

import { useChatRoomSelect, useOpenChatRoomSettingsModal } from 'src/features/chat-room'

import { ChatRoomPreview } from 'src/entities/chat-room'

import { DbChatRoomType } from 'src/shared/config'
import { AppButton } from 'src/shared/ui'

import { RoomTypingContact } from '../RoomTypingContact/RoomTypingContact'

export const ChatRoomHeader = ({ selectedChatRoom }: { selectedChatRoom: DbChatRoomType }) => {
  const { selectChatWithAsideById } = useChatRoomSelect()
  const { openChatRoomSettingsModal } = useOpenChatRoomSettingsModal()

  return (
    <div className="chat-room-header">
      <div className="chat-room-header__mobile-back-button">
        <AppButton prefixIconName="arrow-left" onClick={() => selectChatWithAsideById('')} borderless />
      </div>
      <div className="chat-room-header__info">
        <ChatRoomPreview room={selectedChatRoom} headerMode onClick={openChatRoomSettingsModal} titleSize="large" />
        <RoomTypingContact selectedChatRoom={selectedChatRoom} />
      </div>
    </div>
  )
}
