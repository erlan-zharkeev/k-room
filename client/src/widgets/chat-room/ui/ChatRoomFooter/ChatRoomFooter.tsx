import type { IChatRoomFooterProps } from 'src/widgets/chat-room/ui/ChatRoomFooter/config'

import { MessageInput } from 'src/features/message'

export const ChatRoomFooter = ({ roomId, prependChildren }: IChatRoomFooterProps) => {
  return (
    <div className="chat-room-footer">
      {prependChildren}
      <MessageInput roomId={roomId} />
    </div>
  )
}
