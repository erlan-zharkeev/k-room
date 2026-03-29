import { MessageInput } from 'src/features/message'

import type { IChatRoomFooterProps } from '../..'

export const ChatRoomFooter = ({ roomId, prependChildren }: IChatRoomFooterProps) => {
  return (
    <div className="chat-room-footer">
      {prependChildren}
      <MessageInput roomId={roomId} />
    </div>
  )
}
