import { CreateChatRoomForm } from 'src/features/chat-room/create-chat-room/ui/CreateChatRoomForm/CreateChatRoomForm'

export const CreateChatRoomModal = ({ onSuccess }: { onSuccess?: () => void }) => {
  return (
    <div className="create-chat-room-modal">
      <CreateChatRoomForm onSuccess={onSuccess} />
    </div>
  )
}
