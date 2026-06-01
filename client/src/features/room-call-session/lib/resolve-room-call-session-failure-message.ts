import { ROOM_CALL_ACK_FAILURE_REASON, type RoomCallAckFailureReason } from 'global-shared'

import { ROOM_CALL_SESSION_I18N } from '../config/i18n'

export const resolveRoomCallStartFailureMessage = (reason?: RoomCallAckFailureReason) => {
  if (reason === ROOM_CALL_ACK_FAILURE_REASON.ACCESS_FAILED) return ROOM_CALL_SESSION_I18N.roomCallAccessFailed
  if (reason === ROOM_CALL_ACK_FAILURE_REASON.ALREADY_ACTIVE) return ROOM_CALL_SESSION_I18N.roomCallAlreadyActive

  return ROOM_CALL_SESSION_I18N.roomCallStartFailed
}

export const resolveRoomCallJoinFailureMessage = (reason?: RoomCallAckFailureReason) => {
  if (reason === ROOM_CALL_ACK_FAILURE_REASON.ACCESS_FAILED) return ROOM_CALL_SESSION_I18N.roomCallAccessFailed
  if (reason === ROOM_CALL_ACK_FAILURE_REASON.LIMIT_REACHED) return ROOM_CALL_SESSION_I18N.roomCallLimitReached

  return ROOM_CALL_SESSION_I18N.roomCallJoinFailed
}
