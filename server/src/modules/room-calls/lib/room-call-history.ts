import type { RoomCall } from 'global-shared'

import { RoomCallModel } from '../room-calls.model'

export const saveRoomCallHistory = async ({
  calledAt,
  finishedAt,
  id,
  initiatorId,
  mediaKind,
  participants,
  roomId,
  startedAt,
  status
}: RoomCall) => {
  await RoomCallModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        calledAt,
        finishedAt,
        initiatorId,
        mediaKind,
        participants,
        roomId,
        startedAt,
        status
      }
    },
    { upsert: true }
  )
}
