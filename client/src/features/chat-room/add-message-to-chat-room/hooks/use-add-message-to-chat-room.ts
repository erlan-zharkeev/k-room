import { useChatRoom } from 'src/entities/chat-room'

export const useAddMessageToChatRoom = () => {
  const { mutate } = useChatRoom()

  const addMessageToChatRoom = async (roomId: string, messageId: string) => {
    await mutate(roomId, (room) => {
      room.messages = Array.isArray(room.messages) ? room.messages : []

      if (room.messages[room.messages.length - 1] !== messageId) {
        room.messages.push(messageId)
      }
    })
  }

  return { addMessageToChatRoom }
}
