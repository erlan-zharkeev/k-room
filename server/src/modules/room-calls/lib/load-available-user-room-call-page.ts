import type { EventLoadRoomCalls, EventRoomCallsLoaded } from 'global-shared'

import type { RedisService } from 'src/modules/security/redis.service'

import { loadUserChatRoomIds } from '../../user/lib/user-persistence'

import { loadUserRoomCallPage } from './load-user-room-calls'
import { resolveUserRoomCallSearchRoomIds } from './resolve-user-room-call-search-room-ids'
import { filterAvailableRoomCallsForUser } from './room-call-decline-state'

export const loadAvailableUserRoomCallPage = async (
  redisService: RedisService,
  userId: string,
  payload: EventLoadRoomCalls
): Promise<EventRoomCallsLoaded | null> => {
  const user = await loadUserChatRoomIds(userId)

  if (!user) return null

  const roomIds = await resolveUserRoomCallSearchRoomIds(userId, user.personal.chatRooms, payload.query)
  const roomCallPage = await loadUserRoomCallPage(roomIds, payload.limit, payload.beforeCalledAt)
  const roomCalls = await filterAvailableRoomCallsForUser(redisService, roomCallPage.roomCalls, userId)

  return {
    ...roomCallPage,
    roomCalls
  }
}
