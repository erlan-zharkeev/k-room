import type { RoomCall } from 'global-shared'
import { describe, expect, it } from 'vitest'

import {
  canJoinRoomCallActivity,
  canLeaveRoomCallActivity,
  isCurrentSocketRoomCallParticipant
} from './room-call-activity-permissions'

const createRoomCall = (participantSocketId = 'socket-current'): Pick<RoomCall, 'participants'> => ({
  participants: [
    {
      userId: 'user-current',
      socketId: participantSocketId,
      joinedAt: 1,
      mediaState: {
        audio: true,
        screen: false,
        video: false
      }
    }
  ]
})

describe('room call activity permissions', () => {
  it('detects current active participant by socket id', () => {
    expect(isCurrentSocketRoomCallParticipant(createRoomCall(), 'user-current', 'socket-current')).toBe(true)
    expect(isCurrentSocketRoomCallParticipant(createRoomCall('socket-another'), 'user-current', 'socket-current')).toBe(
      false
    )
  })

  it('prevents joining and allows leaving when current socket is already a participant', () => {
    expect(canJoinRoomCallActivity('joinable', true)).toBe(false)
    expect(canLeaveRoomCallActivity('joinable', true, false)).toBe(true)
  })

  it('allows leaving outgoing calls only for the active local session', () => {
    expect(canLeaveRoomCallActivity('outgoing', false, true)).toBe(true)
    expect(canLeaveRoomCallActivity('outgoing', false, false)).toBe(false)
  })
})
