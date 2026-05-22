import { isRoomPrivate } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import type { ChatRoomRecord } from 'src/shared/lib'

export const useChatRoomContactLookup = () => {
  const { contactById } = useContact()

  const getChatRoomPrivateContact = (room: ChatRoomRecord) =>
    isRoomPrivate(room) ? contactById.value.get(room.users[0]) : undefined

  return {
    getChatRoomPrivateContact
  }
}
