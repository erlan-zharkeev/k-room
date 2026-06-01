import { ROOM_CALL_MEDIA_KIND, type RoomCallMediaKind } from 'global-shared'

import type { RoomCallParticipantMediaStateSchema, RoomCallParticipantSchema } from '../room-calls.types'

export const buildInitialRoomCallMediaState = (mediaKind: RoomCallMediaKind): RoomCallParticipantMediaStateSchema => ({
  audio: true,
  video: mediaKind === ROOM_CALL_MEDIA_KIND.VIDEO,
  screen: mediaKind === ROOM_CALL_MEDIA_KIND.SCREEN
})

export const buildRoomCallParticipant = (
  userId: string,
  socketId: string,
  mediaState: RoomCallParticipantMediaStateSchema
): RoomCallParticipantSchema => ({
  userId,
  socketId,
  joinedAt: Date.now(),
  mediaState
})

export const resolveActiveRoomCallParticipants = (participants: RoomCallParticipantSchema[]) =>
  participants.filter((participant) => !participant.leftAt)

export const resolveRoomCallParticipantByUserId = (participants: RoomCallParticipantSchema[], userId: string) =>
  participants.find((participant) => participant.userId === userId)

export const resolveActiveRoomCallUserIds = (participants: RoomCallParticipantSchema[]) =>
  resolveActiveRoomCallParticipants(participants).map((participant) => participant.userId)

export const resolveRemainingRoomCallParticipants = (
  participants: RoomCallParticipantSchema[],
  userId: string,
  socketId: string
) =>
  resolveActiveRoomCallParticipants(participants).filter((participant) => {
    const isLeavingParticipant = participant.userId === userId && participant.socketId === socketId

    return !isLeavingParticipant
  })

export const resolveActiveRoomCallParticipantByUserId = (participants: RoomCallParticipantSchema[], userId: string) =>
  resolveActiveRoomCallParticipants(participants).find((participant) => participant.userId === userId)
