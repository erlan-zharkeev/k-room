import type { ChatRoom } from 'global-shared'

export const getRoomDisplayedLastMessageId = (room: ChatRoom) => {
  const { messages, lastMessageId } = room

  return messages[messages.length - 1] ?? lastMessageId
}
