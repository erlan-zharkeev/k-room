import { ROOM_CALL_STATUS, type RoomCall } from 'global-shared'

export const isRoomCallActive = ({ finishedAt, status }: RoomCall) => {
  const hasFinishedAt = Boolean(finishedAt)
  const isFinishedStatus = status === ROOM_CALL_STATUS.FINISHED

  return !hasFinishedAt && !isFinishedStatus
}

export const isRoomCallMissed = (roomCall: RoomCall) => {
  const isActive = isRoomCallActive(roomCall)
  const hasStartedAt = Boolean(roomCall.startedAt)

  return !isActive && !hasStartedAt
}
