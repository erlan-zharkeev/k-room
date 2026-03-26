import './style.scss'
import { useRef, useState } from 'react'

import { ChatRoomHeader, ChatRoomStub, ChatRoomFooter } from 'src/widgets/chat-room'
import { CHAT_ROOM_I18N } from 'src/widgets/chat-room/ui/ChatRoom/config'

import { ChatRoomSettingsModal, useChatRoomSelect } from 'src/features/chat-room'
import { MessageList, ReplyMessage } from 'src/features/message'

import { useChatRoom } from 'src/entities/chat-room'
import { useI18n } from 'src/entities/system'

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
          <AppModal title={t(CHAT_ROOM_I18N.groupChatInfo)} open={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)}>
            <ChatRoomSettingsModal onClose={() => setIsSettingsModalOpen(false)} />
          </AppModal>
        </div>
      ) : (
        <ChatRoomStub />
      )}
    </div>
  )
}
