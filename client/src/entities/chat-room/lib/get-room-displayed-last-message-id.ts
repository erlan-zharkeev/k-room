import type { IChatRoom } from 'global-shared'

export const getRoomDisplayedLastMessageId = (room: IChatRoom) =>
  room.messages[room.messages.length - 1] ?? room.lastMessageId
