import { FChatRoomType } from 'src/shared/config'
import { db } from 'src/shared/lib'

export const useAddMessageToChatRoom = () => {
  const addMessageToChatRoom = async (roomId: string, messageId: string) => {
    await db.transaction('rw', db['chat-rooms'], async () => {
      await db['chat-rooms']
        .where('id')
        .equals(roomId)
        .modify((room: FChatRoomType) => {
          room.messages = Array.isArray(room.messages) ? room.messages : []
          if (room.messages[room.messages.length - 1] !== messageId) {
            room.messages.push(messageId)
          }
        })
    })
  }

  return { addMessageToChatRoom }
}
