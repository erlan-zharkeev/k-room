import { ROOM_CALL_PARTICIPANT_LIMIT, ROOM_CALL_STATUS } from 'global-shared'

export const buildActiveRoomCallFilter = () => ({
  finishedAt: { $exists: false },
  status: { $ne: ROOM_CALL_STATUS.FINISHED }
})

export const buildActiveRoomCallParticipantFilter = (userId: string, socketId: string) => ({
  participants: {
    $elemMatch: {
      userId,
      socketId,
      leftAt: { $exists: false }
    }
  }
})

export const buildRoomCallParticipantLimitFilter = () => ({
  $expr: {
    $lt: [
      {
        $size: {
          $filter: {
            input: '$participants',
            as: 'participant',
            cond: { $not: ['$$participant.leftAt'] }
          }
        }
      },
      ROOM_CALL_PARTICIPANT_LIMIT
    ]
  }
})
