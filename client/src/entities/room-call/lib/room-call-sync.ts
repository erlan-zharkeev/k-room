import {
  type EventRoomCallEnded,
  type EventRoomCallJoined,
  type EventRoomCallLeft,
  type EventRoomCallMediaStateUpdated,
  type RoomCall
} from 'global-shared'

export const applyRoomCallJoined = (roomCall: RoomCall, { participant, startedAt }: EventRoomCallJoined) => {
  const participantIndex = roomCall.participants.findIndex(({ userId }) => userId === participant.userId)

  roomCall.status = 'in-progress'
  roomCall.startedAt = startedAt

  if (participantIndex === -1) {
    roomCall.participants.push(participant)
    return
  }

  roomCall.participants[participantIndex] = participant
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
