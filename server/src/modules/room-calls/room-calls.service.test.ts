import { ROOM_CALL_DEFAULT_PARTICIPANT_QUICK_COMMAND_STATE } from 'global-shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ChatRoomCallAccessProjection } from '../chat-rooms/chat-rooms.types'

import {
  joinRoomCall,
  leaveActiveRoomCallsBySocket,
  leaveRoomCall,
  updateRoomCallMediaState
} from './room-calls.service'
import type { RoomCallActiveParticipant, RoomCallActiveState } from './room-calls.types'

const roomCallAccessMock = vi.hoisted(() => ({
  assertRoomCallJoinAccess: vi.fn(),
  assertRoomCallParticipantAccess: vi.fn()
}))

const leaveRoomCallParticipantMock = vi.hoisted(() => ({
  finishRoomCall: vi.fn(),
  leaveRoomCallParticipant: vi.fn()
}))

const roomCallActiveStateMock = vi.hoisted(() => ({
  createActiveRoomCall: vi.fn(),
  readActiveRoomCallByRoomId: vi.fn(),
  readActiveRoomCallsBySocketId: vi.fn(),
  transformActiveRoomCallParticipant: vi.fn(),
  transformActiveRoomCallToRoomCall: vi.fn(),
  updateActiveRoomCall: vi.fn()
}))

const presenceUtilsMock = vi.hoisted(() => ({
  emitToUsers: vi.fn()
}))

vi.mock('./lib/assert-room-call-access', () => roomCallAccessMock)
vi.mock('./lib/leave-room-call-participant', () => leaveRoomCallParticipantMock)
vi.mock('./lib/room-call-active-state', () => roomCallActiveStateMock)
vi.mock('../presence/presence.utils', () => presenceUtilsMock)

const createRoom = (chatKind: ChatRoomCallAccessProjection['chatKind']): ChatRoomCallAccessProjection => ({
  chatKind,
  users: ['user-a', 'user-b']
})

const createRoomCallParticipant = (userId: string, socketId: string, joinedAt: number): RoomCallActiveParticipant => ({
  joinedAt,
  mediaState: {
    audio: true,
    screen: false,
    video: false
  },
  quickCommandState: { ...ROOM_CALL_DEFAULT_PARTICIPANT_QUICK_COMMAND_STATE },
  serverInstanceId: 'server-id',
  socketId,
  userId
})

const createRoomCall = (): RoomCallActiveState => ({
  id: 'room-call-id',
  calledAt: 1,
  initiatorId: 'user-a',
  mediaKind: 'audio',
  participants: [
    createRoomCallParticipant('user-a', 'socket-a', 1),
    createRoomCallParticipant('user-b', 'socket-b', 2)
  ],
  roomId: 'room-id',
  startedAt: 2,
  status: 'in-progress'
})

describe('room-calls.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('finishes private room call when participant leaves', async () => {
    const redisService = {}
    const room = createRoom('direct')
    const roomCall = createRoomCall()

    roomCallAccessMock.assertRoomCallParticipantAccess.mockResolvedValue({
      room,
      roomCall
    })

    await leaveRoomCall(redisService as never, 'user-a', 'socket-a', {
      reason: 'left',
      roomCallId: roomCall.id
    })

    expect(leaveRoomCallParticipantMock.finishRoomCall).toHaveBeenCalledWith(redisService, roomCall, room.users)
    expect(leaveRoomCallParticipantMock.leaveRoomCallParticipant).not.toHaveBeenCalled()
  })

  it('keeps group room call active when participant leaves', async () => {
    const redisService = {}
    const room = createRoom('group')
    const roomCall = createRoomCall()

    roomCallAccessMock.assertRoomCallParticipantAccess.mockResolvedValue({
      room,
      roomCall
    })

    await leaveRoomCall(redisService as never, 'user-a', 'socket-a', {
      reason: 'left',
      roomCallId: roomCall.id
    })

    expect(leaveRoomCallParticipantMock.leaveRoomCallParticipant).toHaveBeenCalledWith(
      redisService,
      roomCall,
      'user-a',
      'socket-a',
      'left',
      undefined
    )
    expect(leaveRoomCallParticipantMock.finishRoomCall).not.toHaveBeenCalled()
  })

  it('finishes two-person room call when socket disconnects', async () => {
    const redisService = {}
    const roomCall = createRoomCall()

    roomCallActiveStateMock.readActiveRoomCallsBySocketId.mockResolvedValue([roomCall])

    await leaveActiveRoomCallsBySocket(redisService as never, 'user-a', 'socket-a')

    expect(leaveRoomCallParticipantMock.finishRoomCall).toHaveBeenCalledWith(redisService, roomCall, [
      'user-a',
      'user-b'
    ])
    expect(leaveRoomCallParticipantMock.leaveRoomCallParticipant).not.toHaveBeenCalled()
  })

  it('keeps multi-person room call active when socket disconnects', async () => {
    const redisService = {}
    const roomCall: RoomCallActiveState = {
      ...createRoomCall(),
      participants: [...createRoomCall().participants, createRoomCallParticipant('user-c', 'socket-c', 3)]
    }

    roomCallActiveStateMock.readActiveRoomCallsBySocketId.mockResolvedValue([roomCall])

    await leaveActiveRoomCallsBySocket(redisService as never, 'user-a', 'socket-a')

    expect(leaveRoomCallParticipantMock.leaveRoomCallParticipant).toHaveBeenCalledWith(
      redisService,
      roomCall,
      'user-a',
      'socket-a',
      'disconnected'
    )
    expect(leaveRoomCallParticipantMock.finishRoomCall).not.toHaveBeenCalled()
  })

  it('rejects joining from another socket when current user is already active in the call', async () => {
    const redisService = {}
    const roomCall = createRoomCall()

    roomCallAccessMock.assertRoomCallJoinAccess.mockResolvedValue(roomCall)

    await expect(
      joinRoomCall(redisService as never, 'user-a', 'socket-a-second-device', 'server-id', {
        roomCallId: roomCall.id
      })
    ).rejects.toMatchObject({
      payload: 'already-active'
    })

    expect(roomCallActiveStateMock.updateActiveRoomCall).not.toHaveBeenCalled()
  })

  it('promotes room call media kind when participant enables video', async () => {
    const redisService = {}
    const roomCall = createRoomCall()
    let updatedRoomCall!: RoomCallActiveState

    roomCallAccessMock.assertRoomCallParticipantAccess.mockResolvedValue({
      room: createRoom('group'),
      roomCall
    })
    roomCallActiveStateMock.updateActiveRoomCall.mockImplementation(async (_redisService, _roomCallId, resolve) => {
      const nextRoomCall = resolve(roomCall)

      if (!nextRoomCall) {
        return null
      }

      updatedRoomCall = nextRoomCall

      return updatedRoomCall
    })

    await updateRoomCallMediaState(redisService as never, 'user-a', 'socket-a', {
      roomCallId: roomCall.id,
      mediaState: {
        audio: true,
        screen: false,
        video: true
      }
    })

    expect(updatedRoomCall.mediaKind).toBe('video')
    expect(presenceUtilsMock.emitToUsers).toHaveBeenCalledWith(['user-a', 'user-b'], 'room-call-media-state-updated', {
      mediaKind: 'video',
      mediaState: {
        audio: true,
        screen: false,
        video: true
      },
      roomCallId: roomCall.id,
      userId: 'user-a'
    })
  })
})
