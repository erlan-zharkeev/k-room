import type { ChatRoom } from 'global-shared'

import { getRoomInterlocutorId, isRoomPrivate } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useUser } from 'src/entities/user'

export const useChatRoomContactLookup = () => {
  const { contactById } = useContact()
  const { user } = useUser()

  const getChatRoomPrivateContact = (room: ChatRoom) =>
    isRoomPrivate(room) ? contactById.value.get(getRoomInterlocutorId(room, user.value.id)) : undefined

  return {
    getChatRoomPrivateContact
  }
}
