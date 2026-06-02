import { ROOM_CALL_STATUS, type RoomCall } from 'global-shared'

export const isCallStatusRoomCallVisible = ({ finishedAt, status }: RoomCall) => {
  const hasFinishedAt = Boolean(finishedAt)
  const isFinishedStatus = status === ROOM_CALL_STATUS.FINISHED

  return !hasFinishedAt && !isFinishedStatus
}
