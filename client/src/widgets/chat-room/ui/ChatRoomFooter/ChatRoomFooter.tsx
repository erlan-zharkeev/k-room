import './style.scss'

import { MessageInput, ReplyMessage } from 'src/features/message'

export const ChatRoomFooter = () => {
  return (
    <div className="chat-room-footer">
      <ReplyMessage />
      {/* <MessageInput /> */}
    </div>
  )
}
