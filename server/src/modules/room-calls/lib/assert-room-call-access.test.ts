import { CHAT_KIND, ROOM_CALL_MEDIA_KIND, ROOM_CALL_STATUS } from 'global-shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ChatRoomCallAccessProjection } from '../../chat-rooms/chat-rooms.types'
import type { RoomCallActiveState } from '../room-calls.types'

const chatRoomPersistenceMock = vi.hoisted(() => ({
  findRoomCallAccessByUser: vi.fn()
}))

const roomCallActiveStateMock = vi.hoisted(() => ({
  readActiveRoomCall: vi.fn()
}))

vi.mock('../../chat-rooms/lib/chat-room-persistence', () => chatRoomPersistenceMock)
vi.mock('./room-call-active-state', () => roomCallActiveStateMock)

import { assertRoomCallParticipantAccess } from './assert-room-call-access'

const createRoomCall = (): RoomCallActiveState => ({
  id: 'room-call-id',
  calledAt: 1,
  initiatorId: 'user-a',
  mediaKind: ROOM_CALL_MEDIA_KIND.AUDIO,
  participants: [
    {
      joinedAt: 1,
      mediaState: {
        audio: true,
        screen: false,
        video: false
      },
      serverInstanceId: 'server-id',
      socketId: 'socket-a',
      userId: 'user-a'
    }
  ],
  roomId: 'room-id',
  startedAt: 2,
  status: ROOM_CALL_STATUS.IN_PROGRESS
})

const createRoom = (): ChatRoomCallAccessProjection => ({
  chatKind: CHAT_KIND.DIRECT,
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
    expect(result.room.chatKind).toBe(CHAT_KIND.DIRECT)
  })
})
