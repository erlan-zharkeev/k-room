import { isRoomPrivate } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import type { ChatRoomRecordType } from 'src/shared/lib'

export const useChatRoomContactLookup = () => {
  const { contactById } = useContact()

  const getChatRoomPrivateContact = (room: ChatRoomRecordType) =>
    isRoomPrivate(room) ? contactById.value.get(room.users[0]) : undefined

  return {
    getChatRoomPrivateContact
  }
}
