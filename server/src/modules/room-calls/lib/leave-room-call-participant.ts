import { type RoomCallLeaveReason } from 'global-shared'

import { emitToUsers } from 'src/modules/presence/presence.utils'
import type { RedisService } from 'src/modules/security/redis.service'

import type { RoomCallActiveState } from '../room-calls.types'

import { removeActiveRoomCall, transformActiveRoomCallToRoomCall, updateActiveRoomCall } from './room-call-active-state'
import { saveRoomCallHistory } from './room-call-history'
import { resolveActiveRoomCallParticipants, resolveRemainingRoomCallParticipants } from './room-call-participant'

export const persistFinishedRoomCall = async (redisService: RedisService, roomCall: RoomCallActiveState) => {
  await saveRoomCallHistory(transformActiveRoomCallToRoomCall(roomCall))

  return removeActiveRoomCall(redisService, roomCall)
}

export const finishRoomCall = async (
  redisService: RedisService,
  roomCall: RoomCallActiveState,
  recipientIds: string[],
  finishedAt = Date.now()
) => {
  const updatedRoomCall = await updateActiveRoomCall(redisService, roomCall.id, (currentRoomCall) => ({
    ...currentRoomCall,
    finishedAt,
    status: 'finished',
    participants: currentRoomCall.participants.map((participant) =>
      participant.leftAt ? participant : { ...participant, leftAt: finishedAt }
    )
  }))

  if (!updatedRoomCall) {
    return
  }

  await persistFinishedRoomCall(redisService, updatedRoomCall)

  emitToUsers(recipientIds, 'room-call-ended', {
    finishedAt,
    roomCallId: roomCall.id
  })
}

export const leaveRoomCallParticipant = async (
  redisService: RedisService,
  roomCall: RoomCallActiveState,
  userId: string,
  socketId: string,
  reason: RoomCallLeaveReason,
  recipientIds?: string[]
) => {
  const leftAt = Date.now()
  const activeParticipants = resolveActiveRoomCallParticipants(roomCall.participants)
  const updatedRoomCall = await updateActiveRoomCall(redisService, roomCall.id, (currentRoomCall) => {
    const currentParticipant = currentRoomCall.participants.find((participant) => {
      const isCurrentUser = participant.userId === userId
      const isCurrentSocket = participant.socketId === socketId
      const isActiveParticipant = !participant.leftAt

      return isCurrentUser && isCurrentSocket && isActiveParticipant
    })

    if (!currentParticipant) {
      return null
    }

    const remainingParticipants = resolveRemainingRoomCallParticipants(currentRoomCall.participants, userId, socketId)
    const shouldFinishRoomCall = remainingParticipants.length <= 1
    const participants = currentRoomCall.participants.map((participant) => {
      const isCurrentUser = participant.userId === userId
      const isCurrentSocket = participant.socketId === socketId
      const isLeavingParticipant = isCurrentUser && isCurrentSocket
      const shouldMarkParticipantLeft = isLeavingParticipant || (shouldFinishRoomCall && !participant.leftAt)

      return shouldMarkParticipantLeft ? { ...participant, leftAt } : participant
    })

    if (!shouldFinishRoomCall) {
      return {
        ...currentRoomCall,
        participants
      }
    }

    return {
      ...currentRoomCall,
      finishedAt: leftAt,
      status: 'finished',
      participants
    }
  })

  if (!updatedRoomCall) {
    return
  }

  const eventRecipientIds = recipientIds ?? activeParticipants.map((participant) => participant.userId)

  emitToUsers(eventRecipientIds, 'room-call-left', {
    leftAt,
    reason,
    roomCallId: roomCall.id,
    userId
  })

  if (updatedRoomCall.finishedAt) {
    await persistFinishedRoomCall(redisService, updatedRoomCall)

    emitToUsers(eventRecipientIds, 'room-call-ended', {
      finishedAt: leftAt,
      roomCallId: roomCall.id
    })
  }
}
