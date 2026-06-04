import { ROOM_CALL_LEAVE_REASON } from 'global-shared'

import type { RedisService } from 'src/modules/security/redis.service'

import { leaveRoomCallParticipant } from './leave-room-call-participant'
import { isRoomCallServerInstanceAlive, readActiveRoomCalls } from './room-call-active-state'
import { resolveActiveRoomCallParticipants } from './room-call-participant'

export const cleanupStaleRoomCallParticipants = async (redisService: RedisService) => {
  const roomCalls = await readActiveRoomCalls(redisService)

  for (const roomCall of roomCalls) {
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
  }
}
