import { REQ_STATUS, ROOM_CALL_ACK_FAILURE_REASON, ROOM_CALL_STATUS, ROOM_PARTICIPANT_LIMIT } from 'global-shared'

import type { RedisService } from 'src/modules/security/redis.service'
import { AppError } from 'src/shared/lib/app-error'

import { findRoomUsersByUser } from '../../chat-rooms/lib/chat-room-persistence'
import { ROOM_CALLS_I18N } from '../room-calls.i18n'

import { readActiveRoomCall } from './room-call-active-state'
import { resolveActiveRoomCallParticipants } from './room-call-participant'

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

  return room
}

export const assertActiveRoomCallAccess = async (redisService: RedisService, userId: string, roomCallId: string) => {
  const roomCall = await readActiveRoomCall(redisService, roomCallId)

  if (!roomCall) {
    throw new AppError(
      REQ_STATUS.badRequest,
      ROOM_CALLS_I18N.roomCallAccessFailed,
      true,
      undefined,
      ROOM_CALL_ACK_FAILURE_REASON.ACCESS_FAILED
    )
  }

  const hasFinishedAt = Boolean(roomCall.finishedAt)
  const isFinishedStatus = roomCall.status === ROOM_CALL_STATUS.FINISHED

  if (hasFinishedAt || isFinishedStatus) {
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

  return {
    room,
    roomCall
  }
}

export const assertRoomCallJoinAccess = async (redisService: RedisService, userId: string, roomCallId: string) => {
  const { roomCall } = await assertActiveRoomCallAccess(redisService, userId, roomCallId)
  const activeParticipants = resolveActiveRoomCallParticipants(roomCall.participants)
  const isCurrentUserActiveParticipant = activeParticipants.some((participant) => participant.userId === userId)

  if (!isCurrentUserActiveParticipant && activeParticipants.length >= ROOM_PARTICIPANT_LIMIT) {
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

export const assertRoomCallParticipantAccess = async (
  redisService: RedisService,
  userId: string,
  socketId: string,
  roomCallId: string
) => {
  const { roomCall } = await assertActiveRoomCallAccess(redisService, userId, roomCallId)
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
