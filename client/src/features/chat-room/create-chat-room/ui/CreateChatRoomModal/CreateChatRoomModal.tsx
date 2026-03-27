import { CreateChatRoomForm } from 'src/features/chat-room'
import type { ICreateChatRoomModalProps } from 'src/features/chat-room/create-chat-room/ui/CreateChatRoomModal/config'

export const CreateChatRoomModal = ({ onSuccess }: ICreateChatRoomModalProps) => {
  return (
    <div className="create-chat-room-modal">
      <CreateChatRoomForm onSuccess={onSuccess} />
    </div>
  )
}
