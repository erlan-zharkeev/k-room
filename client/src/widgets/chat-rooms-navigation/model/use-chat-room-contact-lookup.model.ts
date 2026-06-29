import type { ChatRoom } from 'global-shared'

import { getRoomInterlocutorId, isRoomPrivate, isRoomSupport } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useKnownUser } from 'src/entities/known-user'
import { useUser } from 'src/entities/user'

export const useChatRoomContactLookup = () => {
  const { contactById } = useContact()
  const { knownUserById } = useKnownUser()
  const { user } = useUser()

  const getChatRoomPrivateContact = (room: ChatRoom) =>
    isRoomPrivate(room) ? contactById.value.get(getRoomInterlocutorId(room, user.value.id)) : undefined
  const getChatRoomSupportContact = (room: ChatRoom) => {
    if (!isRoomSupport(room) || !room.supportOwnerId || room.supportOwnerId === user.value.id) {
      return undefined
    }

    return contactById.value.get(room.supportOwnerId) ?? knownUserById.value.get(room.supportOwnerId)
  }

  return {
    getChatRoomPrivateContact,
    getChatRoomSupportContact
  }
}
