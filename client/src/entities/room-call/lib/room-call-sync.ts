import {
  type EventRoomCallEnded,
  type EventRoomCallJoined,
  type EventRoomCallLeft,
  type EventRoomCallMediaStateUpdated,
  type RoomCallParticipant,
  type RoomCall
} from 'global-shared'

const resolveRoomCallStatusRank = (status: RoomCall['status']) => {
  if (status === 'finished') return 2
  if (status === 'in-progress') return 1

  return 0
}

const mergeRoomCallParticipant = (
  currentParticipant: RoomCallParticipant | undefined,
  incomingParticipant: RoomCallParticipant,
  preferCurrentActive = false
) => {
  if (!currentParticipant) {
    return incomingParticipant
  }

  if (preferCurrentActive && !currentParticipant.leftAt && !incomingParticipant.leftAt) {
    return currentParticipant
  }

  if (!currentParticipant?.leftAt) {
    return incomingParticipant
  }

  if (incomingParticipant.joinedAt > currentParticipant.joinedAt) {
    return incomingParticipant
  }

  if (incomingParticipant.leftAt && incomingParticipant.leftAt >= currentParticipant.leftAt) {
    return incomingParticipant
  }

  return {
    ...incomingParticipant,
    leftAt: currentParticipant.leftAt
  }
}

export const applyRoomCallSnapshot = (roomCall: RoomCall, incomingRoomCall: RoomCall) => {
  const incomingFinishedAt = incomingRoomCall.finishedAt
  const isLocallyFinished = roomCall.status === 'finished' || Boolean(roomCall.finishedAt)
  const isIncomingOlderLifecycle =
    resolveRoomCallStatusRank(incomingRoomCall.status) < resolveRoomCallStatusRank(roomCall.status)
  const shouldApplyIncomingFinish =
    incomingFinishedAt !== undefined && (!roomCall.finishedAt || incomingFinishedAt > roomCall.finishedAt)
  const participantByUserId = new Map(roomCall.participants.map((participant) => [participant.userId, participant]))

  roomCall.roomId = incomingRoomCall.roomId
  roomCall.initiatorId = incomingRoomCall.initiatorId
  roomCall.calledAt = incomingRoomCall.calledAt
  roomCall.startedAt = isIncomingOlderLifecycle ? roomCall.startedAt : incomingRoomCall.startedAt
  roomCall.mediaKind = isIncomingOlderLifecycle ? roomCall.mediaKind : incomingRoomCall.mediaKind

  if ((!isLocallyFinished && !isIncomingOlderLifecycle) || incomingRoomCall.status === 'finished') {
    roomCall.status = incomingRoomCall.status
  }

  if (shouldApplyIncomingFinish) {
    roomCall.finishedAt = incomingFinishedAt
  }

  incomingRoomCall.participants.forEach((incomingParticipant) => {
    participantByUserId.set(
      incomingParticipant.userId,
      mergeRoomCallParticipant(
        participantByUserId.get(incomingParticipant.userId),
        incomingParticipant,
        isIncomingOlderLifecycle
      )
    )
  })
  roomCall.participants = [...participantByUserId.values()]
}

export const mergeRoomCallSnapshot = (roomCall: RoomCall | undefined, incomingRoomCall: RoomCall) => {
  if (!roomCall) return incomingRoomCall

  const nextRoomCall: RoomCall = {
    ...roomCall,
    participants: roomCall.participants.map((participant) => ({
      ...participant,
      mediaState: {
        ...participant.mediaState
      }
    }))
  }

  applyRoomCallSnapshot(nextRoomCall, incomingRoomCall)

  return nextRoomCall
}

export const applyRoomCallJoined = (roomCall: RoomCall, payload: EventRoomCallJoined) => {
  const { participant, roomCall: incomingRoomCall, startedAt } = payload

  applyRoomCallSnapshot(roomCall, incomingRoomCall)

  const participantIndex = roomCall.participants.findIndex(({ userId }) => userId === participant.userId)

  if (!roomCall.finishedAt) {
    roomCall.status = 'in-progress'
    roomCall.startedAt = startedAt
  }

  if (participantIndex === -1) {
    roomCall.participants.push(participant)
    return
  }

  roomCall.participants[participantIndex] = mergeRoomCallParticipant(
    roomCall.participants[participantIndex],
    participant
  )
}

export const applyRoomCallLeft = (roomCall: RoomCall, { leftAt, userId }: EventRoomCallLeft) => {
  const participant = roomCall.participants.find((participant) => participant.userId === userId)

  if (!participant) {
    return
  }

  participant.leftAt = leftAt
}

export const applyRoomCallEnded = (roomCall: RoomCall, { finishedAt }: EventRoomCallEnded) => {
  roomCall.finishedAt = finishedAt
  roomCall.status = 'finished'
}

export const applyRoomCallMediaStateUpdated = (
  roomCall: RoomCall,
  { mediaKind, mediaState, userId }: EventRoomCallMediaStateUpdated
) => {
  roomCall.mediaKind = mediaKind

  const participant = roomCall.participants.find((participant) => participant.userId === userId)

  if (!participant) {
    return
  }

  participant.mediaState = mediaState
}
