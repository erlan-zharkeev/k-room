import type { RoomCall } from 'global-shared'

import type { RoomCallActivityKind } from '../config/types'

export const isCurrentSocketRoomCallParticipant = (
  roomCall: Pick<RoomCall, 'participants'>,
  currentUserId: string,
  currentSocketId?: string
) =>
  Boolean(
    currentSocketId &&
      roomCall.participants.some((participant) => {
        const isCurrentUser = participant.userId === currentUserId
        const isCurrentSocket = participant.socketId === currentSocketId
        const isActiveParticipant = !participant.leftAt

        return isCurrentUser && isCurrentSocket && isActiveParticipant
      })
  )

export const canJoinRoomCallActivity = (kind: RoomCallActivityKind, isCurrentSocketParticipant: boolean) =>
  !isCurrentSocketParticipant && (kind === 'incoming' || kind === 'joinable')

export const canLeaveRoomCallActivity = (
  kind: RoomCallActivityKind,
  isCurrentSocketParticipant: boolean,
  isActiveSessionRoomCall: boolean
) =>
  isCurrentSocketParticipant ||
  kind === 'active' ||
  kind === 'incoming' ||
  (kind === 'outgoing' && isActiveSessionRoomCall)
