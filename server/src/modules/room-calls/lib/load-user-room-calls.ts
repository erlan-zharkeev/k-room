import { ROOM_CALL_ACTUALIZATION_LIMIT, type RoomCall } from 'global-shared'

import type { RedisService } from 'src/modules/security/redis.service'

import { RoomCallModel } from '../room-calls.model'
import type { RoomCallDocument } from '../room-calls.types'

import { readActiveRoomCallsByRoomIds, transformActiveRoomCallToRoomCall } from './room-call-active-state'
import { transformRoomCall } from './transform-room-call'

const sortRoomCallsByCalledAt = (roomCalls: RoomCall[]) =>
  [...roomCalls].sort((firstCall, secondCall) => secondCall.calledAt - firstCall.calledAt)

export const loadUserRoomCallHistoryPage = async (roomIds: string[], limit: number, beforeCalledAt?: number) => {
  if (!roomIds.length) {
    return {
      roomCalls: [],
      nextBeforeCalledAt: null,
      hasMore: false
    }
  }

  const roomCalls = await RoomCallModel.find({
    roomId: { $in: roomIds },
    finishedAt: { $exists: true },
    ...(beforeCalledAt && { calledAt: { $lt: beforeCalledAt } })
  })
    .sort({ calledAt: -1 })
    .limit(limit + 1)
    .lean<RoomCallDocument[]>()
  const hasMore = roomCalls.length > limit
  const pageRoomCalls = roomCalls.slice(0, limit)
  const pageLastRoomCall = pageRoomCalls[pageRoomCalls.length - 1]

  return {
    roomCalls: pageRoomCalls.map(transformRoomCall),
    nextBeforeCalledAt: hasMore && pageLastRoomCall ? pageLastRoomCall.calledAt : null,
    hasMore
  }
}

export const loadUserRoomCallPage = async (
  redisService: RedisService,
  roomIds: string[],
  limit: number,
  beforeCalledAt?: number
) => {
  if (beforeCalledAt) {
    return loadUserRoomCallHistoryPage(roomIds, limit, beforeCalledAt)
  }

  const activeRoomCalls = (await readActiveRoomCallsByRoomIds(redisService, roomIds)).map(
    transformActiveRoomCallToRoomCall
  )
  const activeRoomCallIds = new Set(activeRoomCalls.map(({ id }) => id))
  const historyLimit = limit + activeRoomCalls.length
  const historyPage = await loadUserRoomCallHistoryPage(roomIds, historyLimit, beforeCalledAt)
  const historyRoomCalls = historyPage.roomCalls.filter(({ id }) => !activeRoomCallIds.has(id))
  const roomCalls = sortRoomCallsByCalledAt([...activeRoomCalls, ...historyRoomCalls]).slice(0, limit)
  const roomCallIds = new Set(roomCalls.map(({ id }) => id))
  const hasHiddenHistoryRoomCalls = historyRoomCalls.some(({ id }) => !roomCallIds.has(id))
  const lastHistoryRoomCall = [...roomCalls].reverse().find(({ id }) => !activeRoomCallIds.has(id))
  const nextBeforeCalledAt =
    lastHistoryRoomCall && (historyPage.hasMore || hasHiddenHistoryRoomCalls) ? lastHistoryRoomCall.calledAt : null

  return {
    roomCalls,
    nextBeforeCalledAt,
    hasMore: historyPage.hasMore || hasHiddenHistoryRoomCalls
  }
}

export const loadUserRoomCalls = async (redisService: RedisService, roomIds: string[]) => {
  const { roomCalls } = await loadUserRoomCallPage(redisService, roomIds, ROOM_CALL_ACTUALIZATION_LIMIT)

  return roomCalls
}
