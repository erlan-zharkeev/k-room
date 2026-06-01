import { ROOM_CALL_ACTUALIZATION_LIMIT } from 'global-shared'

import { RoomCallModel } from '../room-calls.model'
import type { RoomCallDocument } from '../room-calls.types'

import { transformRoomCall } from './transform-room-call'

export const loadUserRoomCalls = async (roomIds: string[]) => {
  if (!roomIds.length) {
    return []
  }

  const roomCalls = await RoomCallModel.find({
    roomId: { $in: roomIds }
  })
    .sort({ calledAt: -1 })
    .limit(ROOM_CALL_ACTUALIZATION_LIMIT)
    .lean<RoomCallDocument[]>()

  return roomCalls.map(transformRoomCall)
}
