import {
  REQ_STATUS,
  ROOM_CALL_ACK_FAILURE_REASON,
  ROOM_CALL_PARTICIPANT_LIMIT,
  ROOM_CALL_STATUS
} from 'global-shared'

import { AppError } from 'src/shared/lib/app-error'

import { findRoomUsersByUser } from '../../chat-rooms/lib/chat-room-persistence'
import { ROOM_CALLS_I18N } from '../room-calls.i18n'
import { RoomCallModel } from '../room-calls.model'
import type { RoomCallDocument } from '../room-calls.types'

import { resolveActiveRoomCallParticipants } from './room-call-participant'

export const findActiveRoomCallByRoomId = (roomId: string) => {
  return RoomCallModel.findOne({
    roomId,
    finishedAt: { $exists: false },
    status: { $ne: ROOM_CALL_STATUS.FINISHED }
  }).lean<RoomCallDocument>()
}

export const findActiveRoomCallById = (roomCallId: string) => {
  return RoomCallModel.findOne({
    _id: roomCallId,
    finishedAt: { $exists: false },
    status: { $ne: ROOM_CALL_STATUS.FINISHED }
  }).lean<RoomCallDocument>()
}

export const assertRoomCallStartAccess = async (userId: string, roomId: string) => {
  const room = await findRoomUsersByUser(roomId, userId)

  if (!room) {
    throw new AppError(
      REQ_STATUS.badRequest,
      ROOM_CALLS_I18N.roomCallStartFailed,
      true,
      undefined,
      ROOM_CALL_ACK_FAILURE_REASON.ACCESS_FAILED
    )
  }

  const activeRoomCall = await findActiveRoomCallByRoomId(roomId)

  if (activeRoomCall) {
    throw new AppError(
      REQ_STATUS.badRequest,
      ROOM_CALLS_I18N.roomCallAlreadyActive,
      true,
      undefined,
      ROOM_CALL_ACK_FAILURE_REASON.ALREADY_ACTIVE
    )
  }

  return room
}

export const assertRoomCallJoinAccess = async (userId: string, roomCallId: string) => {
  const roomCall = await findActiveRoomCallById(roomCallId)

  if (!roomCall) {
    throw new AppError(
      REQ_STATUS.badRequest,
      ROOM_CALLS_I18N.roomCallAccessFailed,
      true,
      undefined,
      ROOM_CALL_ACK_FAILURE_REASON.ACCESS_FAILED
    )
  }

  const room = await findRoomUsersByUser(roomCall.roomId, userId)

  if (!room) {
    throw new AppError(
      REQ_STATUS.badRequest,
      ROOM_CALLS_I18N.roomCallAccessFailed,
      true,
      undefined,
      ROOM_CALL_ACK_FAILURE_REASON.ACCESS_FAILED
    )
  }

  const activeParticipants = resolveActiveRoomCallParticipants(roomCall.participants)
  const isCurrentUserActiveParticipant = activeParticipants.some((participant) => participant.userId === userId)

  if (!isCurrentUserActiveParticipant && activeParticipants.length >= ROOM_CALL_PARTICIPANT_LIMIT) {
    throw new AppError(
      REQ_STATUS.badRequest,
      ROOM_CALLS_I18N.roomCallLimitReached,
      true,
      undefined,
      ROOM_CALL_ACK_FAILURE_REASON.LIMIT_REACHED
    )
  }

  return roomCall
}

export const assertRoomCallParticipantAccess = async (userId: string, socketId: string, roomCallId: string) => {
  const roomCall = await findActiveRoomCallById(roomCallId)

  if (!roomCall) {
    throw new AppError(REQ_STATUS.badRequest, ROOM_CALLS_I18N.roomCallJoinFailed)
  }

  const room = await findRoomUsersByUser(roomCall.roomId, userId)

  if (!room) {
    throw new AppError(REQ_STATUS.badRequest, ROOM_CALLS_I18N.roomCallJoinFailed)
  }

  const participant = roomCall.participants.find((participant) => {
    const isCurrentUser = participant.userId === userId
    const isCurrentSocket = participant.socketId === socketId
    const isActiveParticipant = !participant.leftAt

    return isCurrentUser && isCurrentSocket && isActiveParticipant
  })

  if (!participant) {
    throw new AppError(REQ_STATUS.badRequest, ROOM_CALLS_I18N.roomCallAccessFailed)
  }

  return {
    participant,
    roomCall
  }
}
