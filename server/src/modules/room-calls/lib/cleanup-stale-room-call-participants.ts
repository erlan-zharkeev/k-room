import { ROOM_CALL_LEAVE_REASON, ROOM_CALL_STATUS } from 'global-shared'

import type { RedisService } from 'src/modules/security/redis.service'

import type { RoomCallActiveState } from '../room-calls.types'

import { leaveRoomCallParticipant, persistFinishedRoomCall } from './leave-room-call-participant'
import { isRoomCallServerInstanceAlive, readActiveRoomCalls } from './room-call-active-state'
import { resolveActiveRoomCallParticipants } from './room-call-participant'

const isFinishedRoomCall = ({ finishedAt, status }: RoomCallActiveState) => {
  const hasFinishedAt = Boolean(finishedAt)
  const isFinishedStatus = status === ROOM_CALL_STATUS.FINISHED

  return hasFinishedAt || isFinishedStatus
}

export const cleanupStaleRoomCall = async (redisService: RedisService, roomCall: RoomCallActiveState) => {
  if (isFinishedRoomCall(roomCall)) {
    return persistFinishedRoomCall(redisService, roomCall)
  }

  const activeParticipants = resolveActiveRoomCallParticipants(roomCall.participants)
  const participantInstanceStates = await Promise.all(
    activeParticipants.map((participant) => isRoomCallServerInstanceAlive(redisService, participant.serverInstanceId))
  )
  const staleParticipants = activeParticipants.filter((_participant, index) => !participantInstanceStates[index])

  for (const participant of staleParticipants) {
    await leaveRoomCallParticipant(
      redisService,
      roomCall,
      participant.userId,
      participant.socketId,
      ROOM_CALL_LEAVE_REASON.DISCONNECTED
    )
  }

  return staleParticipants.length > 0
}

export const cleanupStaleRoomCallParticipants = async (redisService: RedisService) => {
  const roomCalls = await readActiveRoomCalls(redisService)

  for (const roomCall of roomCalls) {
    await cleanupStaleRoomCall(redisService, roomCall)
  }
}
