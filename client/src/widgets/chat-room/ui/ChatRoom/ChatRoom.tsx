import './style.scss'
import { useRef, useState } from 'react'

import { CHAT_ROOM_I18N, ChatRoomHeader, ChatRoomStub, ChatRoomFooter } from 'src/widgets/chat-room'

import { ChatRoomSettingsModal } from 'src/features/chat-room-settings'
import { MessageList } from 'src/features/message-list'
import { ReplyMessage } from 'src/features/reply-message'
import { useChatRoomSelect } from 'src/features/select-chat-room'

import { useChatRoom } from 'src/entities/chat-room'

import { useI18n } from 'src/shared/preferences'
import { AppModal } from 'src/shared/ui'

export const ChatRoom = () => {
  const { selectedChatRoom } = useChatRoom()
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const { resetChatRoomSelection } = useChatRoomSelect()
  const { t } = useI18n()

  const roomDomEl = useRef<HTMLDivElement>(null)

  return (
    <div className="chat-room" ref={roomDomEl}>
      {selectedChatRoom ? (
        <div className="chat-room__content">
          <ChatRoomHeader
            room={selectedChatRoom}
            onClickChatRoomSettings={() => setIsSettingsModalOpen(true)}
            onResetChatRoomSelection={resetChatRoomSelection}
          />
          <MessageList room={selectedChatRoom} />
          <ChatRoomFooter roomId={selectedChatRoom.id} prependChildren={<ReplyMessage />} />
          <AppModal
            title={t(CHAT_ROOM_I18N.groupChatInfo)}
            open={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
          >
            <ChatRoomSettingsModal onClose={() => setIsSettingsModalOpen(false)} />
          </AppModal>
        </div>
      ) : (
        <ChatRoomStub />
      )}
    </div>
  )
}
