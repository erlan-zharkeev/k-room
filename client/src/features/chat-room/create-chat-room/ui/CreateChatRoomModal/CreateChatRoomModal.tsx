import { ICreateChatRoomModalProps, CreateChatRoomForm } from 'src/features/chat-room'

export const CreateChatRoomModal = ({ onSuccess }: ICreateChatRoomModalProps) => {
  return (
    <div className="create-chat-room-modal">
      <CreateChatRoomForm onSuccess={onSuccess} />
    </div>
  )
}
