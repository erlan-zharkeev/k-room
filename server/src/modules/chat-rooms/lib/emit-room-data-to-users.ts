import { getRoomOtherUserIds } from 'global-shared'

import type { PresenceService } from 'src/modules/presence/presence.service'
import { emitToUsers } from 'src/modules/presence/presence.utils'
import { loadUserRoomPreferences } from 'src/modules/user/lib/user-persistence'
import { stringifyMongoIds } from 'src/shared/lib/normalize-object-id'

import type { ChatRoomDocument } from '../chat-rooms.types'

import { resolveKnownUsers } from './resolve-known-users'
import { transformRoomForUser } from './transform-room-for-user'

const emitKnownUsersToUser = async (userId: string, roomUserIds: string[], presenceService: PresenceService) => {
  const otherUserIds = getRoomOtherUserIds({ users: roomUserIds }, userId)
  const knownUsers = await resolveKnownUsers(otherUserIds, presenceService)

  emitToUsers([userId], 'known-users-updated', knownUsers)
}

const emitRoomToUsers = async (
  userIds: string[],
  room: ChatRoomDocument,
  presenceService: PresenceService,
  eventName: 'room-data-updated' | 'new-room-added'
) => {
  const roomUserIds = stringifyMongoIds(room.users)

  await Promise.all(
    userIds.map(async (userId) => {
      const userData = await loadUserRoomPreferences(userId)

      if (!userData) {
        return
      }

      const transformedRoom = await transformRoomForUser({
        userId,
        room,
        pinnedChatRoomIds: userData.personal.pinnedChatRoomIds,
        mutedChatRoomIds: userData.personal.mutedChatRoomIds
      })

      await emitKnownUsersToUser(userId, roomUserIds, presenceService)
      emitToUsers([userId], eventName, transformedRoom)
    })
  )
}

export const emitRoomDataToUsers = async (
  userIds: string[],
  room: ChatRoomDocument,
  presenceService: PresenceService
) => {
  await emitRoomToUsers(userIds, room, presenceService, 'room-data-updated')
}

export const emitNewRoomToUsers = async (
  userIds: string[],
  room: ChatRoomDocument,
  presenceService: PresenceService
) => {
  await emitRoomToUsers(userIds, room, presenceService, 'new-room-added')
}
