import './style.scss'
import { useRef, useState } from 'react'

import { useChatRoom } from 'src/entities/chat-room'

import { useI18n } from 'src/shared/preferences'
import { AppModal } from 'src/shared/ui'

import { ChatRoomFooter } from '../ChatRoomFooter/ChatRoomFooter'
import { ChatRoomHeader } from '../ChatRoomHeader/ChatRoomHeader'
import { ChatRoomMessages } from '../ChatRoomMessages/ChatRoomMessages'
import { ChatRoomStub } from '../ChatRoomStub/ChatRoomStub'
import { CHAT_ROOM_I18N } from './i18n.ts'
import { ChatRoomSettingsModal } from './ChatRoomSettingsModal/ChatRoomSettingsModal'
import { ReplyMessage } from './ReplyMessage/ReplyMessage'
import { useChatRoomSelect } from '../../../../model/use-chat-room-select'

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
          <ChatRoomMessages room={selectedChatRoom} />
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
