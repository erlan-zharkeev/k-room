import {
  getRoomOtherUserIds,
  type Contact,
  type EventGetContacts,
  type EventGetRooms,
  type EventRoomCallsUpdated
} from 'global-shared'
import uniq from 'lodash/uniq'

import { stringifyMongoId } from 'src/shared/lib/normalize-object-id'

import { loadChatRoomsByIds, loadSupportChatRooms } from '../../chat-rooms/lib/chat-room-persistence'
import { ensureFavoritesChatRoom } from '../../chat-rooms/lib/ensure-favorites-chat-room'
import { resolveKnownUsers } from '../../chat-rooms/lib/resolve-known-users'
import { transformRoomForUser } from '../../chat-rooms/lib/transform-room-for-user'
import type { PresenceService } from '../../presence/presence.service'
import { loadUserRoomCalls } from '../../room-calls/lib/load-user-room-calls'
import { filterAvailableRoomCallsForUser } from '../../room-calls/lib/room-call-decline-state'
import type { RedisService } from '../../security/redis.service'

import { transformUserToFrontendContact } from './transform-user'
import { loadUserById } from './user-persistence'

export const resolveActualUserSocketData = async (
  userId: string,
  presenceService: PresenceService,
  redisService: RedisService
) => {
  const data = await loadUserById(userId)

  if (!data) {
    return null
  }

  const { contacts, chatRooms: personalRoomIds, pinnedChatRoomIds, mutedChatRoomIds } = data.personal
  const favoritesChatRoomId = await ensureFavoritesChatRoom(userId)
  const roomIds = personalRoomIds.includes(favoritesChatRoomId)
    ? personalRoomIds
    : [favoritesChatRoomId, ...personalRoomIds]
  const contactResultData: Contact[] = await transformUserToFrontendContact(contacts, presenceService)
  const personalRooms = await loadChatRoomsByIds(roomIds)
  const supportRooms = data.system.role === 'admin' ? await loadSupportChatRooms() : []
  const personalRoomIdSet = new Set(roomIds)
  const rooms = [...personalRooms, ...supportRooms.filter((room) => !personalRoomIdSet.has(stringifyMongoId(room._id)))]
  const knownUserIds = uniq(rooms.flatMap((room) => getRoomOtherUserIds(room, userId)))
  const knownUsers = await resolveKnownUsers(knownUserIds, presenceService)
  const contactsPayload: EventGetContacts = {
    contacts: contactResultData,
    knownUsers
  }
  const roomsPayload: EventGetRooms = await Promise.all(
    rooms.map((room) => transformRoomForUser({ userId, room, pinnedChatRoomIds, mutedChatRoomIds }))
  )
  const roomCalls = await loadUserRoomCalls(redisService, roomIds)
  const roomCallsPayload: EventRoomCallsUpdated = await filterAvailableRoomCallsForUser(redisService, roomCalls, userId)

  return {
    contactsPayload,
    roomCallsPayload,
    roomsPayload
  }
}
