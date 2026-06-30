import { describe, expect, it } from 'vitest'

import {
  applyRoomCallEnded,
  applyRoomCallJoined,
  applyRoomCallLeft,
  applyRoomCallMediaStateUpdated
} from './room-call-sync'
import { createRoomCallTestFixture } from './room-call-test-fixtures'

describe('room call sync', () => {
  it('applies room call live updates to cached room call object', () => {
    const roomCall = createRoomCallTestFixture()
    const joinedParticipant = {
      userId: 'user-2',
      socketId: 'socket-2',
      joinedAt: 200,
      mediaState: {
        audio: true,
        video: false,
        screen: false
      }
    }

    applyRoomCallJoined(roomCall, {
      roomCallId: 'call-1',
      participant: joinedParticipant,
      startedAt: 200
    })
    applyRoomCallMediaStateUpdated(roomCall, {
      roomCallId: 'call-1',
      userId: 'user-2',
      mediaKind: 'screen',
      mediaState: {
        audio: false,
        video: false,
        screen: true
      }
    })
    applyRoomCallLeft(roomCall, {
      roomCallId: 'call-1',
      userId: 'user-2',
      reason: 'left',
      leftAt: 300
    })
    applyRoomCallEnded(roomCall, {
      roomCallId: 'call-1',
      finishedAt: 400
    })

    expect(roomCall.status).toBe('finished')
    expect(roomCall.mediaKind).toBe('screen')
    expect(roomCall.startedAt).toBe(200)
    expect(roomCall.finishedAt).toBe(400)
    expect(roomCall.participants[1]).toMatchObject({
      userId: 'user-2',
      leftAt: 300,
      mediaState: {
        audio: false,
        video: false,
        screen: true
      }
    })
  })
})
