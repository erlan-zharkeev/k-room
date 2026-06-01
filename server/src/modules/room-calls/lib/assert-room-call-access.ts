import { REQ_STATUS, ROOM_CALL_PARTICIPANT_LIMIT, ROOM_CALL_STATUS } from 'global-shared'

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
    throw new AppError(REQ_STATUS.badRequest, ROOM_CALLS_I18N.roomCallStartFailed)
  }

  const activeRoomCall = await findActiveRoomCallByRoomId(roomId)

  if (activeRoomCall) {
    throw new AppError(REQ_STATUS.badRequest, ROOM_CALLS_I18N.roomCallAlreadyActive)
  }
}

export const assertRoomCallJoinAccess = async (userId: string, roomCallId: string) => {
  const roomCall = await findActiveRoomCallById(roomCallId)

  if (!roomCall) {
    throw new AppError(REQ_STATUS.badRequest, ROOM_CALLS_I18N.roomCallJoinFailed)
  }

  const room = await findRoomUsersByUser(roomCall.roomId, userId)

  if (!room) {
    throw new AppError(REQ_STATUS.badRequest, ROOM_CALLS_I18N.roomCallJoinFailed)
  }

  const activeParticipants = resolveActiveRoomCallParticipants(roomCall.participants)
  const isCurrentUserActiveParticipant = activeParticipants.some((participant) => participant.userId === userId)

  if (!isCurrentUserActiveParticipant && activeParticipants.length >= ROOM_CALL_PARTICIPANT_LIMIT) {
    throw new AppError(REQ_STATUS.badRequest, ROOM_CALLS_I18N.roomCallLimitReached)
  }

  return roomCall
}
