import {
  ROOM_CALL_DEFAULT_PARTICIPANT_QUICK_COMMAND_STATE,
  type RoomCallMediaKind,
  type RoomCallParticipantQuickCommandStateByUserId
} from 'global-shared'

import type {
  RoomCallActiveParticipant,
  RoomCallParticipantMediaStateSchema,
  RoomCallParticipantSchema
} from '../room-calls.types'

export const buildInitialRoomCallMediaState = (mediaKind: RoomCallMediaKind): RoomCallParticipantMediaStateSchema => ({
  audio: true,
  video: mediaKind === 'video',
  screen: mediaKind === 'screen'
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

export const buildRoomCallActiveParticipant = (
  userId: string,
  socketId: string,
  serverInstanceId: string,
  mediaState: RoomCallParticipantMediaStateSchema
): RoomCallActiveParticipant => ({
  ...buildRoomCallParticipant(userId, socketId, mediaState),
  quickCommandState: { ...ROOM_CALL_DEFAULT_PARTICIPANT_QUICK_COMMAND_STATE },
  serverInstanceId
})

export const resolveActiveRoomCallParticipants = <TParticipant extends RoomCallParticipantSchema>(
  participants: TParticipant[]
) => participants.filter((participant) => !participant.leftAt)

export const resolveRoomCallParticipantByUserId = <TParticipant extends RoomCallParticipantSchema>(
  participants: TParticipant[],
  userId: string
) => participants.find((participant) => participant.userId === userId)

export const resolveActiveRoomCallUserIds = (participants: RoomCallParticipantSchema[]) =>
  resolveActiveRoomCallParticipants(participants).map((participant) => participant.userId)

export const buildRoomCallParticipantQuickCommandStateByUserId = (
  participants: RoomCallActiveParticipant[]
): RoomCallParticipantQuickCommandStateByUserId => {
  const quickCommandStateByUserId: RoomCallParticipantQuickCommandStateByUserId = {}

  resolveActiveRoomCallParticipants(participants).forEach(({ quickCommandState, userId }) => {
    quickCommandStateByUserId[userId] = quickCommandState
  })

  return quickCommandStateByUserId
}

export const resolveRemainingRoomCallParticipants = <TParticipant extends RoomCallParticipantSchema>(
  participants: TParticipant[],
  userId: string,
  socketId: string
) =>
  resolveActiveRoomCallParticipants(participants).filter((participant) => {
    const isLeavingParticipant = participant.userId === userId && participant.socketId === socketId

    return !isLeavingParticipant
  })

export const resolveActiveRoomCallParticipantByUserId = <TParticipant extends RoomCallParticipantSchema>(
  participants: TParticipant[],
  userId: string
) => resolveActiveRoomCallParticipants(participants).find((participant) => participant.userId === userId)

export const resolveActiveScreenSharingRoomCallParticipant = <TParticipant extends RoomCallParticipantSchema>(
  participants: TParticipant[]
) => resolveActiveRoomCallParticipants(participants).find(({ mediaState }) => mediaState.screen)
