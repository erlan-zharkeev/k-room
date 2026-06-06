import { CHAT_KIND, ROOM_CALL_LEAVE_REASON, ROOM_CALL_MEDIA_KIND, ROOM_CALL_STATUS } from 'global-shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ChatRoomCallAccessProjection } from '../chat-rooms/chat-rooms.types'

import { leaveRoomCall } from './room-calls.service'
import type { RoomCallActiveState } from './room-calls.types'

const roomCallAccessMock = vi.hoisted(() => ({
  assertRoomCallParticipantAccess: vi.fn()
}))

const leaveRoomCallParticipantMock = vi.hoisted(() => ({
  finishRoomCall: vi.fn(),
  leaveRoomCallParticipant: vi.fn()
}))

vi.mock('./lib/assert-room-call-access', () => roomCallAccessMock)
vi.mock('./lib/leave-room-call-participant', () => leaveRoomCallParticipantMock)

const createRoom = (chatKind: ChatRoomCallAccessProjection['chatKind']): ChatRoomCallAccessProjection => ({
  chatKind,
  users: ['user-a', 'user-b']
})

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
    },
    {
      joinedAt: 2,
      mediaState: {
        audio: true,
        screen: false,
        video: false
      },
      serverInstanceId: 'server-id',
      socketId: 'socket-b',
      userId: 'user-b'
    }
  ],
  roomId: 'room-id',
  startedAt: 2,
  status: ROOM_CALL_STATUS.IN_PROGRESS
})

describe('room-calls.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('finishes private room call when participant leaves', async () => {
    const redisService = {}
    const room = createRoom(CHAT_KIND.DIRECT)
    const roomCall = createRoomCall()

    roomCallAccessMock.assertRoomCallParticipantAccess.mockResolvedValue({
      room,
      roomCall
    })

    await leaveRoomCall(redisService as never, 'user-a', 'socket-a', {
      reason: ROOM_CALL_LEAVE_REASON.LEFT,
      roomCallId: roomCall.id
    })

    expect(leaveRoomCallParticipantMock.finishRoomCall).toHaveBeenCalledWith(redisService, roomCall, room.users)
    expect(leaveRoomCallParticipantMock.leaveRoomCallParticipant).not.toHaveBeenCalled()
  })

  it('keeps group room call active when participant leaves', async () => {
    const redisService = {}
    const room = createRoom(CHAT_KIND.GROUP)
    const roomCall = createRoomCall()

    roomCallAccessMock.assertRoomCallParticipantAccess.mockResolvedValue({
      room,
      roomCall
    })

    await leaveRoomCall(redisService as never, 'user-a', 'socket-a', {
      reason: ROOM_CALL_LEAVE_REASON.LEFT,
      roomCallId: roomCall.id
    })

    expect(leaveRoomCallParticipantMock.leaveRoomCallParticipant).toHaveBeenCalledWith(
      redisService,
      roomCall,
      'user-a',
      'socket-a',
      ROOM_CALL_LEAVE_REASON.LEFT,
      undefined
    )
    expect(leaveRoomCallParticipantMock.finishRoomCall).not.toHaveBeenCalled()
  })
})
