import { RoomCallModel } from '../room-calls.model'

const buildUnseenMissedRoomCallQuery = (userId: string, roomIds: string[], lastSeenCalledAt: number) => ({
  calledAt: { $gt: lastSeenCalledAt },
  finishedAt: { $exists: true },
  initiatorId: { $ne: userId },
  participants: { $not: { $elemMatch: { userId } } },
  roomId: { $in: roomIds },
  startedAt: { $exists: false }
})

export const countUnseenMissedRoomCalls = (userId: string, roomIds: string[], lastSeenCalledAt: number) => {
  if (!roomIds.length) return 0

  return RoomCallModel.countDocuments(buildUnseenMissedRoomCallQuery(userId, roomIds, lastSeenCalledAt))
}
