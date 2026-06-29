import { isRoomSupport } from 'global-shared'

import { loadAdminUserIds } from 'src/modules/user/lib/user-persistence'
import { stringifyMongoId, stringifyMongoIds } from 'src/shared/lib/normalize-object-id'

import type { ChatRoomRecipientSource } from '../chat-rooms.types'

const uniqueUserIds = (userIds: string[]) => Array.from(new Set(userIds))

export const loadSupportChatRoomRecipientIds = async (supportOwnerId: string) => {
  const admins = await loadAdminUserIds()
  const adminIds = admins.map(({ _id }) => stringifyMongoId(_id))

  return uniqueUserIds([supportOwnerId, ...adminIds])
}

export const loadRoomRecipientIds = async (room: ChatRoomRecipientSource) => {
  const roomUserIds = stringifyMongoIds(room.users)

  if (!isRoomSupport(room) || !room.supportOwnerId) {
    return roomUserIds
  }

  const supportRecipientIds = await loadSupportChatRoomRecipientIds(room.supportOwnerId)

  return uniqueUserIds([...roomUserIds, ...supportRecipientIds])
}
