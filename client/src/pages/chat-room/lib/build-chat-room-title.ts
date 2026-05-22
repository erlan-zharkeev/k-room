import type { ContactRecord, KnownUserRecord, ChatRoomRecord } from 'src/shared/lib'

export const buildChatRoomTitle = (
  room: ChatRoomRecord,
  contacts: Array<ContactRecord | KnownUserRecord>,
  isPrivateRoom: boolean
) => room.chatName || (isPrivateRoom ? contacts[0]?.nickname : '') || ''
