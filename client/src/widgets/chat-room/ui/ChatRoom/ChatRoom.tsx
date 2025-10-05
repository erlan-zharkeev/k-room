import './style.scss'
import { useRef } from 'react'

import { MessageList } from 'src/features/message'

import { useChatRoom } from 'src/entities/chat-room'
import { useViewport } from 'src/entities/system'

import { ChatRoomFooter } from '../ChatRoomFooter/ChatRoomFooter'
import { ChatRoomHeader } from '../ChatRoomHeader/ChatRoomHeader'
import { ChatRoomStub } from '../ChatRoomStub/ChatRoomStub'

export const ChatRoom = () => {
  const roomDomEl = useRef<HTMLDivElement>(null)
  const { greaterOrEqualDesktop } = useViewport()

  const { selectedChatRoom, isSelectedRoomPrivate } = useChatRoom()

  return (
    <div className="chat-room" ref={roomDomEl}>
      {greaterOrEqualDesktop && <ChatRoomStub selectedChatRoom={selectedChatRoom} />}
      {selectedChatRoom && (
        <div className="chat-room__content">
          <ChatRoomHeader selectedChatRoom={selectedChatRoom} />
          <MessageList selectedChatRoom={selectedChatRoom} isSelectedRoomPrivate={isSelectedRoomPrivate} />
          <ChatRoomFooter />
        </div>
      )}
    </div>
  )
}
