import { ROOM_CALL_STATUS, type RoomCall } from 'global-shared'

import type { RedisService } from 'src/modules/security/redis.service'

import { ROOM_CALL_DECLINE_STATE_TTL_MS } from '../constants'

const buildRoomCallDeclinedUsersKey = (roomCallId: string) => `room-call:${roomCallId}:declined-user-ids`

export const saveRoomCallDeclinedUser = async (redisService: RedisService, roomCallId: string, userId: string) => {
  const key = buildRoomCallDeclinedUsersKey(roomCallId)

  await redisService.addSetValue(key, userId)
  await redisService.refreshTtl(key, ROOM_CALL_DECLINE_STATE_TTL_MS)
}

export const removeRoomCallDeclinedUser = async (redisService: RedisService, roomCallId: string, userId: string) => {
  await redisService.removeSetValue(buildRoomCallDeclinedUsersKey(roomCallId), userId)
}

const isRoomCallDeclinedByUser = (redisService: RedisService, roomCallId: string, userId: string) =>
  redisService.isSetValueExists(buildRoomCallDeclinedUsersKey(roomCallId), userId)

export const filterAvailableRoomCallsForUser = async (
  redisService: RedisService,
  roomCalls: RoomCall[],
  userId: string
) => {
  const declinedStates = await Promise.all(
    roomCalls.map((roomCall) => {
      const hasFinishedAt = Boolean(roomCall.finishedAt)
      const isFinishedStatus = roomCall.status === ROOM_CALL_STATUS.FINISHED
      const isActiveRoomCall = !hasFinishedAt && !isFinishedStatus

      if (!isActiveRoomCall) {
        return false
      }

      return isRoomCallDeclinedByUser(redisService, roomCall.id, userId)
    })
  )

  return roomCalls.filter((_roomCall, index) => !declinedStates[index])
}
