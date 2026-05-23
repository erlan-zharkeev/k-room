import { getRoomInterlocutorId, isRoomPrivate } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useUser } from 'src/entities/user'
import type { ChatRoomRecord } from 'src/shared/lib'

export const useChatRoomContactLookup = () => {
  const { contactById } = useContact()
  const { user } = useUser()

  const getChatRoomPrivateContact = (room: ChatRoomRecord) =>
    isRoomPrivate(room) ? contactById.value.get(getRoomInterlocutorId(room, user.value.id)) : undefined

  return {
    getChatRoomPrivateContact
  }
}
