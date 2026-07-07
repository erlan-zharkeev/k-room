import { describe, expect, it } from 'vitest'

import {
  applyRoomCallEnded,
  applyRoomCallJoined,
  applyRoomCallLeft,
  applyRoomCallMediaStateUpdated,
  applyRoomCallSnapshot,
  mergeRoomCallSnapshot
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
      roomCall: {
        ...roomCall,
        startedAt: 200,
        status: 'in-progress',
        participants: [roomCall.participants[0], joinedParticipant]
      },
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

  it('restores missing participants from joined room call snapshot', () => {
    const roomCall = {
      ...createRoomCallTestFixture(),
      participants: [
        {
          userId: 'user-2',
          socketId: 'socket-2',
          joinedAt: 200,
          mediaState: {
            audio: true,
            video: true,
            screen: false
          }
        }
      ]
    }
    const initiator = createRoomCallTestFixture().participants[0]
    const joinedParticipant = roomCall.participants[0]

    applyRoomCallJoined(roomCall, {
      roomCallId: 'call-1',
      participant: joinedParticipant,
      roomCall: {
        ...createRoomCallTestFixture(),
        startedAt: 200,
        status: 'in-progress',
        participants: [initiator, joinedParticipant]
      },
      startedAt: 200
    })

    expect(roomCall.participants.map(({ userId }) => userId)).toEqual(['user-2', 'user-1'])
  })

  it('does not resurrect a participant from an older snapshot after that participant left', () => {
    const roomCall = createRoomCallTestFixture()
    const currentParticipant = roomCall.participants[0]

    currentParticipant.leftAt = 300

    applyRoomCallSnapshot(roomCall, {
      ...createRoomCallTestFixture(),
      participants: [
        {
          ...currentParticipant,
          leftAt: undefined
        }
      ]
    })

    expect(roomCall.participants[0].leftAt).toBe(300)
  })

  it('does not downgrade an in-progress room call with an older calling snapshot', () => {
    const roomCall = createRoomCallTestFixture()

    roomCall.mediaKind = 'video'
    roomCall.startedAt = 200
    roomCall.status = 'in-progress'
    roomCall.participants = [
      {
        ...createRoomCallTestFixture().participants[0],
        mediaState: {
          audio: true,
          video: true,
          screen: false
        }
      }
    ]

    applyRoomCallSnapshot(roomCall, {
      ...createRoomCallTestFixture(),
      mediaKind: 'audio',
      startedAt: undefined,
      status: 'calling'
    })

    expect(roomCall.status).toBe('in-progress')
    expect(roomCall.startedAt).toBe(200)
    expect(roomCall.mediaKind).toBe('video')
    expect(roomCall.participants[0].mediaState).toEqual({
      audio: true,
      video: true,
      screen: false
    })
  })

  it('merges a full room call snapshot without mutating the cached room call', () => {
    const roomCall = createRoomCallTestFixture()

    roomCall.startedAt = 200
    roomCall.status = 'in-progress'

    const mergedRoomCall = mergeRoomCallSnapshot(roomCall, {
      ...createRoomCallTestFixture(),
      startedAt: undefined,
      status: 'calling'
    })

    expect(mergedRoomCall).not.toBe(roomCall)
    expect(mergedRoomCall.status).toBe('in-progress')
    expect(mergedRoomCall.startedAt).toBe(200)
    expect(roomCall.status).toBe('in-progress')
    expect(roomCall.startedAt).toBe(200)
  })
})
