import { ReactNode } from 'react'

import { MessageInput } from 'src/features/message'

export const ChatRoomFooter = ({ roomId, prependChildren }: { roomId: string; prependChildren?: ReactNode }) => {
  return (
    <div className="chat-room-footer">
      {prependChildren}
      <MessageInput roomId={roomId} />
    </div>
  )
}
