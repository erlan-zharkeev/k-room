import { ROOM_CALL_STATUS, type RoomCall } from 'global-shared'

export const isRoomCallUnfinished = ({ finishedAt, status }: RoomCall) => {
  const hasFinishedAt = Boolean(finishedAt)
  const isFinishedStatus = status === ROOM_CALL_STATUS.FINISHED

  return !hasFinishedAt && !isFinishedStatus
}

export const isRoomCallBlockingStartForUser = (roomCall: RoomCall, userId: string) => {
  const isCallingRoomCall = roomCall.status === ROOM_CALL_STATUS.CALLING
  const isOutgoingRoomCall = isCallingRoomCall && roomCall.initiatorId === userId
  const hasActiveParticipant = roomCall.participants.some((participant) => {
    const isCurrentUser = participant.userId === userId
    const isParticipantActive = !participant.leftAt

    return isCurrentUser && isParticipantActive
  })

  return isRoomCallUnfinished(roomCall) && (isOutgoingRoomCall || hasActiveParticipant)
}
