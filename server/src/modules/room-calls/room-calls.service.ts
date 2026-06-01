import {
  ROOM_CALL_STATUS,
  type EventJoinRoomCall,
  type EventStartRoomCall,
  type JoinRoomCallAckPayload,
  type StartRoomCallAckPayload
} from 'global-shared'

import { stringifyMongoId } from 'src/shared/lib/normalize-object-id'

import { assertRoomCallJoinAccess, assertRoomCallStartAccess } from './lib/assert-room-call-access'
import { buildRoomCallParticipant, buildInitialRoomCallMediaState } from './lib/room-call-participant'
import { transformRoomCall } from './lib/transform-room-call'
import { RoomCallModel } from './room-calls.model'
import type { RoomCallDocument } from './room-calls.types'

export const startRoomCall = async (
  userId: string,
  socketId: string,
  { roomId, mediaKind }: EventStartRoomCall
): Promise<StartRoomCallAckPayload> => {
  await assertRoomCallStartAccess(userId, roomId)

  const mediaState = buildInitialRoomCallMediaState(mediaKind)
  const participant = buildRoomCallParticipant(userId, socketId, mediaState)
  const roomCall = await new RoomCallModel({
    calledAt: Date.now(),
    roomId,
    initiatorId: userId,
    status: ROOM_CALL_STATUS.CALLING,
    mediaKind,
    participants: [participant]
  }).save()

  return {
    roomCallId: stringifyMongoId(roomCall._id)
  }
}

export const joinRoomCall = async (
  userId: string,
  socketId: string,
  { roomCallId }: EventJoinRoomCall
): Promise<JoinRoomCallAckPayload | null> => {
  const roomCall = await assertRoomCallJoinAccess(userId, roomCallId)
  const mediaState = buildInitialRoomCallMediaState(roomCall.mediaKind)
  const participant = buildRoomCallParticipant(userId, socketId, mediaState)
  const startedAt = roomCall.startedAt ?? Date.now()
  const currentParticipant = roomCall.participants.find((participant) => participant.userId === userId)

  const updatedRoomCall = currentParticipant
    ? await RoomCallModel.findOneAndUpdate(
        { _id: roomCallId, 'participants.userId': userId },
        {
          $set: {
            status: ROOM_CALL_STATUS.IN_PROGRESS,
            startedAt,
            'participants.$.socketId': socketId,
            'participants.$.joinedAt': participant.joinedAt,
            'participants.$.mediaState': mediaState
          },
          $unset: {
            'participants.$.leftAt': ''
          }
        },
        { new: true }
      ).lean<RoomCallDocument>()
    : await RoomCallModel.findOneAndUpdate(
        { _id: roomCallId },
        {
          $set: {
            status: ROOM_CALL_STATUS.IN_PROGRESS,
            startedAt
          },
          $push: {
            participants: participant
          }
        },
        { new: true }
      ).lean<RoomCallDocument>()

  if (!updatedRoomCall) {
    return null
  }

  return {
    roomCall: transformRoomCall(updatedRoomCall)
  }
}
