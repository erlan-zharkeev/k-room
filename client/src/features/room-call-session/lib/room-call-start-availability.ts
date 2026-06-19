import { type RoomCall } from 'global-shared'

export const isRoomCallUnfinished = ({ finishedAt, status }: RoomCall) => {
  const hasFinishedAt = Boolean(finishedAt)
  const isFinishedStatus = status === 'finished'

  return !hasFinishedAt && !isFinishedStatus
}

export const isRoomCallBlockingStartForUser = (roomCall: RoomCall, userId: string) => {
  const isCallingRoomCall = roomCall.status === 'calling'
  const isOutgoingRoomCall = isCallingRoomCall && roomCall.initiatorId === userId
  const hasActiveParticipant = roomCall.participants.some((participant) => {
    const isCurrentUser = participant.userId === userId
    const isParticipantActive = !participant.leftAt

    return isCurrentUser && isParticipantActive
  })

  return isRoomCallUnfinished(roomCall) && (isOutgoingRoomCall || hasActiveParticipant)
}
