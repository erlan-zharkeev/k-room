import type { ChatRoom } from 'global-shared'

import type { ContactRecord, KnownUserRecord } from 'src/shared/lib'

export const buildChatRoomTitle = (
  room: ChatRoom,
  contacts: Array<ContactRecord | KnownUserRecord>,
  isPrivateRoom: boolean
) => room.chatName || (isPrivateRoom ? contacts[0]?.nickname : '') || ''
