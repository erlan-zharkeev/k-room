import { useChatRoom } from 'src/entities/chat-room'

export const useAddMessageToChatRoom = () => {
  const { addMessage } = useChatRoom()

  const addMessageToChatRoom = async (roomId: string, messageId: string) => {
    await addMessage(roomId, messageId)
  }

  return { addMessageToChatRoom }
}
