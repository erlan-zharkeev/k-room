import type { ChatRoomType } from 'global-shared'

export const getRoomDisplayedLastMessageId = (room: ChatRoomType) =>
  room.messages[room.messages.length - 1] ?? room.lastMessageId
