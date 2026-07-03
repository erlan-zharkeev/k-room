import type { RoomCall } from 'global-shared'

export const isRoomCallActive = ({ finishedAt, status }: RoomCall) => {
  const hasFinishedAt = Boolean(finishedAt)
  const isFinishedStatus = status === 'finished'

  return !hasFinishedAt && !isFinishedStatus
}

export const isRoomCallMissed = (roomCall: RoomCall) => {
  const isActive = isRoomCallActive(roomCall)
  const hasStartedAt = Boolean(roomCall.startedAt)

  return !isActive && !hasStartedAt
}

export const isIncomingMissedRoomCall = (roomCall: RoomCall, userId: string) => {
  const isInitiator = roomCall.initiatorId === userId
  const hasJoinedCall = roomCall.participants.some((participant) => participant.userId === userId)

  return isRoomCallMissed(roomCall) && !isInitiator && !hasJoinedCall
}
