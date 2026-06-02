import {
  getRoomOtherUserIds,
  type Contact,
  type EventGetContacts,
  type EventGetRooms,
  type EventRoomCallsUpdated
} from 'global-shared'
import uniq from 'lodash/uniq'

import { resolveKnownUsers, transformRoomForUser } from '../../chat-rooms/chat-rooms.service'
import { loadChatRoomsByIds } from '../../chat-rooms/lib/chat-room-persistence'
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

  const { contacts, chatRooms: roomIds, pinnedChatRoomIds, mutedChatRoomIds } = data.personal
  const contactResultData: Contact[] = await transformUserToFrontendContact(contacts, presenceService)
  const rooms = await loadChatRoomsByIds(roomIds)
  const knownUserIds = uniq(rooms.flatMap((room) => getRoomOtherUserIds(room, userId)))
  const knownUsers = await resolveKnownUsers(knownUserIds, presenceService)
  const contactsPayload: EventGetContacts = {
    contacts: contactResultData,
    knownUsers
  }
  const roomsPayload: EventGetRooms = await Promise.all(
    rooms.map((room) => transformRoomForUser({ userId, room, pinnedChatRoomIds, mutedChatRoomIds }))
  )
  const roomCalls = await loadUserRoomCalls(roomIds)
  const roomCallsPayload: EventRoomCallsUpdated = await filterAvailableRoomCallsForUser(redisService, roomCalls, userId)

  return {
    contactsPayload,
    roomCallsPayload,
    roomsPayload
  }
}
