import type { ContactRecordType, KnownUserRecordType, ChatRoomRecordType } from 'src/shared/lib'

export const buildChatRoomTitle = (
  room: ChatRoomRecordType,
  contacts: Array<ContactRecordType | KnownUserRecordType>,
  isPrivateRoom: boolean
) => room.chatName || (isPrivateRoom ? contacts[0]?.nickname : '') || ''
