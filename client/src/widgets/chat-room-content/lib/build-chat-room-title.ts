import type { ChatRoom } from 'global-shared'

import { isRoomFavorites, isRoomSupport } from 'src/entities/chat-room'
import type { ContactRecord, KnownUserRecord } from 'src/shared/lib'

export const buildChatRoomTitle = (
  room: ChatRoom,
  contacts: Array<ContactRecord | KnownUserRecord>,
  isPrivateRoom: boolean,
  favoritesTitle = '',
  supportTitle = ''
) => {
  if (isRoomFavorites(room)) {
    return favoritesTitle
  }

  if (isRoomSupport(room)) {
    return contacts[0]?.nickname || supportTitle
  }

  return room.chatName || (isPrivateRoom ? contacts[0]?.nickname : '') || ''
}
