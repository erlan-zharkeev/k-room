import { ROOM_CALL_ACTUALIZATION_LIMIT } from 'global-shared'

import { RoomCallModel } from '../room-calls.model'
import type { RoomCallDocument } from '../room-calls.types'

import { transformRoomCall } from './transform-room-call'

export const loadUserRoomCallPage = async (roomIds: string[], limit: number, beforeCalledAt?: number) => {
  if (!roomIds.length) {
    return {
      roomCalls: [],
      nextBeforeCalledAt: null,
      hasMore: false
    }
  }

  const roomCalls = await RoomCallModel.find({
    roomId: { $in: roomIds },
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

export const loadUserRoomCalls = async (roomIds: string[]) => {
  const { roomCalls } = await loadUserRoomCallPage(roomIds, ROOM_CALL_ACTUALIZATION_LIMIT)

  return roomCalls
}
