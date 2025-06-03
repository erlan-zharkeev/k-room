import './style.scss'
import { useRef } from 'react'

import { MessageList } from 'src/features/message'

import { useChatRooms } from 'src/entities/chat-room'

import { ChatRoomFooter } from '../ChatRoomFooter/ChatRoomFooter'
import { ChatRoomHeader } from '../ChatRoomHeader/ChatRoomHeader'
import { ChatRoomStub } from '../ChatRoomStub/ChatRoomStub'

export const ChatRoom = () => {
  const roomDomEl = useRef<HTMLDivElement>(null)

  const { selectedChatRoom, isSelectedRoomPrivate } = useChatRooms()

  return (
    <div className="chat-room" ref={roomDomEl}>
      <ChatRoomStub selectedChatRoom={selectedChatRoom} />
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
