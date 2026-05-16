import type { DbContactType, FChatRoomType } from 'src/shared/lib'

export const buildChatRoomTitle = (room: FChatRoomType, contacts: DbContactType[], isPrivateRoom: boolean) =>
  room.chatName || (isPrivateRoom ? contacts[0]?.nickname : '') || ''
