import './style.scss'
import { useRef } from 'react'

import { MessageList } from 'src/features/message'

import { FChatRoomType } from 'src/shared/config'

import { ChatRoomFooter } from '../ChatRoomFooter/ChatRoomFooter'
import { ChatRoomHeader } from '../ChatRoomHeader/ChatRoomHeader'
import { ChatRoomStub } from '../ChatRoomStub/ChatRoomStub'

export const ChatRoom = ({ room }: { room: FChatRoomType | undefined }) => {
  const roomDomEl = useRef<HTMLDivElement>(null)

  return (
    <div className="chat-room" ref={roomDomEl}>
      <ChatRoomStub room={room} />
      {room && (
        <div className="chat-room__content">
          <ChatRoomHeader room={room} />
          <MessageList room={room} />
          <ChatRoomFooter />
        </div>
      )}
    </div>
  )
}
