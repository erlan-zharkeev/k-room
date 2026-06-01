import { ROOM_CALL_STATUS, type RoomCallLeaveReason } from 'global-shared'
import type { UpdateQuery } from 'mongoose'

import { emitToUsers } from 'src/modules/presence/presence.utils'
import { stringifyMongoId } from 'src/shared/lib/normalize-object-id'

import { RoomCallModel } from '../room-calls.model'
import type { RoomCallDocument, RoomCallSchema } from '../room-calls.types'

import { resolveActiveRoomCallParticipants, resolveRemainingRoomCallParticipants } from './room-call-participant'
import { buildActiveRoomCallParticipantFilter } from './room-call-query'

export const leaveRoomCallParticipant = async (
  roomCall: RoomCallDocument,
  userId: string,
  socketId: string,
  reason: RoomCallLeaveReason
) => {
  const roomCallId = stringifyMongoId(roomCall._id)
  const leftAt = Date.now()
  const activeParticipants = resolveActiveRoomCallParticipants(roomCall.participants)
  const remainingParticipants = resolveRemainingRoomCallParticipants(roomCall.participants, userId, socketId)
  const shouldFinishRoomCall = remainingParticipants.length === 0
  const update: UpdateQuery<RoomCallSchema> = shouldFinishRoomCall
    ? {
        $set: {
          finishedAt: leftAt,
          status: ROOM_CALL_STATUS.FINISHED,
          'participants.$.leftAt': leftAt
        }
      }
    : {
        $set: {
          'participants.$.leftAt': leftAt
        }
      }

  const updatedRoomCall = await RoomCallModel.findOneAndUpdate(
    {
      _id: roomCallId,
      ...buildActiveRoomCallParticipantFilter(userId, socketId)
    },
    update,
    { new: true }
  ).lean<RoomCallDocument>()

  if (!updatedRoomCall) {
    return
  }

  const recipientIds = activeParticipants.map((participant) => participant.userId)

  emitToUsers(recipientIds, 'room-call-left', {
    reason,
    roomCallId,
    userId
  })

  if (shouldFinishRoomCall) {
    emitToUsers(recipientIds, 'room-call-ended', {
      roomCallId
    })
  }
}
