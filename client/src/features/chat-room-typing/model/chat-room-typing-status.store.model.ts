import type { EventRoomTypingStatus } from 'global-shared'
import { reactive } from 'vue'

const typingUserIdsByRoomId = reactive<Record<string, string[] | undefined>>({})

export const selectRoomTypingUserIds = (roomId: string) => typingUserIdsByRoomId[roomId] ?? []

export const updateRoomTypingStatus = ({ roomId, contactId, isTyping }: EventRoomTypingStatus) => {
  const currentUserIds = selectRoomTypingUserIds(roomId)

  if (isTyping) {
    if (currentUserIds.includes(contactId)) return

    typingUserIdsByRoomId[roomId] = [...currentUserIds, contactId]
    return
  }

  const nextUserIds = currentUserIds.filter((id) => id !== contactId)

  if (!nextUserIds.length) {
    delete typingUserIdsByRoomId[roomId]
    return
  }

  typingUserIdsByRoomId[roomId] = nextUserIds
}
