import type { ChatRoom } from 'global-shared'

export const getRoomDisplayedLastMessageId = (room: ChatRoom) =>
  room.messages[room.messages.length - 1] ?? room.lastMessageId
