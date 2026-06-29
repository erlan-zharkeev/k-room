import { ROOM_CALL_DEFAULT_PARTICIPANT_QUICK_COMMAND_STATE } from 'global-shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ChatRoomCallAccessProjection } from '../../chat-rooms/chat-rooms.types'
import type { RoomCallActiveParticipant, RoomCallActiveState } from '../room-calls.types'

const chatRoomPersistenceMock = vi.hoisted(() => ({
  findRoomCallAccessByUser: vi.fn()
}))

const roomCallActiveStateMock = vi.hoisted(() => ({
  readActiveRoomCall: vi.fn()
}))

vi.mock('../../chat-rooms/lib/chat-room-persistence', () => chatRoomPersistenceMock)
vi.mock('./room-call-active-state', () => roomCallActiveStateMock)

import { assertRoomCallParticipantAccess, assertRoomCallStartAccess } from './assert-room-call-access'

const createRoomCallParticipant = (): RoomCallActiveParticipant => ({
  joinedAt: 1,
  mediaState: {
    audio: true,
    screen: false,
    video: false
  },
  quickCommandState: { ...ROOM_CALL_DEFAULT_PARTICIPANT_QUICK_COMMAND_STATE },
  serverInstanceId: 'server-id',
  socketId: 'socket-a',
  userId: 'user-a'
})

const createRoomCall = (): RoomCallActiveState => ({
  id: 'room-call-id',
  calledAt: 1,
  initiatorId: 'user-a',
  mediaKind: 'audio',
  participants: [createRoomCallParticipant()],
  roomId: 'room-id',
  startedAt: 2,
  status: 'in-progress'
})

const createRoom = (): ChatRoomCallAccessProjection => ({
  chatKind: 'direct',
  users: ['user-a', 'user-b']
})

describe('assert-room-call-access', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads call access room shape for room call participant access', async () => {
    const redisService = {}
    const room = createRoom()
    const roomCall = createRoomCall()

    roomCallActiveStateMock.readActiveRoomCall.mockResolvedValue(roomCall)
    chatRoomPersistenceMock.findRoomCallAccessByUser.mockResolvedValue(room)

    const result = await assertRoomCallParticipantAccess(redisService as never, 'user-a', 'socket-a', roomCall.id)

    expect(chatRoomPersistenceMock.findRoomCallAccessByUser).toHaveBeenCalledWith(roomCall.roomId, 'user-a')
    expect(result.room).toBe(room)
    expect(result.room.chatKind).toBe('direct')
  })

  it('rejects starting room call in favorites room', async () => {
    chatRoomPersistenceMock.findRoomCallAccessByUser.mockResolvedValue({
      chatKind: 'favorites',
      users: ['user-a']
    })

    await expect(assertRoomCallStartAccess('user-a', 'room-id')).rejects.toMatchObject({
      payload: 'access-failed'
    })
  })

  it('rejects starting room call in support room', async () => {
    chatRoomPersistenceMock.findRoomCallAccessByUser.mockResolvedValue({
      chatKind: 'support',
      users: ['user-a']
    })

    await expect(assertRoomCallStartAccess('user-a', 'room-id')).rejects.toMatchObject({
      payload: 'access-failed'
    })
  })
})
