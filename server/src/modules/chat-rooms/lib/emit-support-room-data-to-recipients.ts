import type { PresenceService } from 'src/modules/presence/presence.service'

import type { ChatRoomDocument } from '../chat-rooms.types'

import { emitNewRoomToUsers, emitRoomDataToUsers } from './emit-room-data-to-users'
import { loadSupportChatRoomRecipientIds } from './support-chat-room-recipients'

export const emitSupportRoomDataToRecipients = async (
  room: ChatRoomDocument,
  presenceService: PresenceService,
  eventName: 'room-data-updated' | 'new-room-added',
  excludedUserIds: string[] = []
) => {
  if (!room.supportOwnerId) {
    return
  }

  const supportRecipientIds = await loadSupportChatRoomRecipientIds(room.supportOwnerId)
  const recipientIds = supportRecipientIds.filter((userId) => !excludedUserIds.includes(userId))

  if (eventName === 'new-room-added') {
    await emitNewRoomToUsers(recipientIds, room, presenceService)
    return
  }

  await emitRoomDataToUsers(recipientIds, room, presenceService)
}
