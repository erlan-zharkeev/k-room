import type { ICreateChatRoomModalProps } from '../../..'
import { CreateChatRoomForm } from '../../..'

export const CreateChatRoomModal = ({ onSuccess }: ICreateChatRoomModalProps) => {
  return (
    <div className="create-chat-room-modal">
      <CreateChatRoomForm onSuccess={onSuccess} />
    </div>
  )
}
