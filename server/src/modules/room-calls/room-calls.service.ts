import {
  REQ_STATUS,
  ROOM_CALL_LEAVE_REASON,
  ROOM_CALL_STATUS,
  type EventJoinRoomCall,
  type EventLeaveRoomCall,
  type EventSendRoomCallSignal,
  type EventStartRoomCall,
  type EventUpdateRoomCallMediaState,
  type JoinRoomCallAckPayload,
  type StartRoomCallAckPayload
} from 'global-shared'

import { AppError } from 'src/shared/lib/app-error'

import { emitToUsers } from '../presence/presence.utils'

import {
  assertRoomCallJoinAccess,
  assertRoomCallParticipantAccess,
  assertRoomCallStartAccess
} from './lib/assert-room-call-access'
import { leaveRoomCallParticipant } from './lib/leave-room-call-participant'
import { emitRoomCallSignalReceived } from './lib/room-call-events'
import {
  buildInitialRoomCallMediaState,
  buildRoomCallParticipant,
  resolveActiveRoomCallParticipantByUserId,
  resolveActiveRoomCallUserIds,
  resolveRoomCallParticipantByUserId
} from './lib/room-call-participant'
import {
  buildActiveRoomCallFilter,
  buildActiveRoomCallParticipantFilter,
  buildRoomCallParticipantLimitFilter
} from './lib/room-call-query'
import { transformRoomCall } from './lib/transform-room-call'
import { ROOM_CALLS_I18N } from './room-calls.i18n'
import { RoomCallModel } from './room-calls.model'
import type { RoomCallDocument } from './room-calls.types'

export const startRoomCall = async (
  userId: string,
  socketId: string,
  { roomId, mediaKind }: EventStartRoomCall
): Promise<StartRoomCallAckPayload> => {
  const room = await assertRoomCallStartAccess(userId, roomId)

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
  const transformedRoomCall = transformRoomCall(roomCall.toObject())

  emitToUsers(room.users, 'room-call-started', {
    roomCall: transformedRoomCall
  })

  return {
    roomCallId: transformedRoomCall.id
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
  const currentParticipant = resolveRoomCallParticipantByUserId(roomCall.participants, userId)
  const isCurrentParticipantActive = Boolean(currentParticipant && !currentParticipant.leftAt)

  const updatedRoomCall = currentParticipant
    ? await RoomCallModel.findOneAndUpdate(
        {
          _id: roomCallId,
          ...buildActiveRoomCallFilter(),
          'participants.userId': userId,
          ...(!isCurrentParticipantActive && buildRoomCallParticipantLimitFilter())
        },
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
        { _id: roomCallId, ...buildActiveRoomCallFilter(), ...buildRoomCallParticipantLimitFilter() },
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

  emitToUsers(resolveActiveRoomCallUserIds(updatedRoomCall.participants), 'room-call-joined', {
    participant,
    roomCallId,
    startedAt
  })

  return {
    roomCall: transformRoomCall(updatedRoomCall)
  }
}

export const leaveRoomCall = async (userId: string, socketId: string, payload: EventLeaveRoomCall) => {
  const { roomCall } = await assertRoomCallParticipantAccess(userId, socketId, payload.roomCallId)

  await leaveRoomCallParticipant(roomCall, userId, socketId, payload.reason)
}

export const leaveActiveRoomCallsBySocket = async (userId: string, socketId: string) => {
  const activeRoomCalls = await RoomCallModel.find({
    ...buildActiveRoomCallFilter(),
    ...buildActiveRoomCallParticipantFilter(userId, socketId)
  }).lean<RoomCallDocument[]>()

  await Promise.all(
    activeRoomCalls.map((roomCall) =>
      leaveRoomCallParticipant(roomCall, userId, socketId, ROOM_CALL_LEAVE_REASON.DISCONNECTED)
    )
  )
}

export const updateRoomCallMediaState = async (
  userId: string,
  socketId: string,
  { roomCallId, mediaState }: EventUpdateRoomCallMediaState
) => {
  await assertRoomCallParticipantAccess(userId, socketId, roomCallId)

  const updatedRoomCall = await RoomCallModel.findOneAndUpdate(
    {
      _id: roomCallId,
      ...buildActiveRoomCallFilter(),
      ...buildActiveRoomCallParticipantFilter(userId, socketId)
    },
    {
      $set: {
        'participants.$.mediaState': mediaState
      }
    },
    { new: true }
  ).lean<RoomCallDocument>()

  if (!updatedRoomCall) {
    return
  }

  emitToUsers(resolveActiveRoomCallUserIds(updatedRoomCall.participants), 'room-call-media-state-updated', {
    mediaState,
    roomCallId,
    userId
  })
}

export const sendRoomCallSignal = async (
  userId: string,
  socketId: string,
  { roomCallId, signal, signalKind, toUserId }: EventSendRoomCallSignal
) => {
  const { roomCall } = await assertRoomCallParticipantAccess(userId, socketId, roomCallId)
  const targetParticipant = resolveActiveRoomCallParticipantByUserId(roomCall.participants, toUserId)

  if (!targetParticipant) {
    throw new AppError(REQ_STATUS.badRequest, ROOM_CALLS_I18N.roomCallSignalFailed)
  }

  emitRoomCallSignalReceived(targetParticipant.socketId, {
    fromUserId: userId,
    roomCallId,
    signal,
    signalKind
  })
}
