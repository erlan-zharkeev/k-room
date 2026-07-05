import { ROOM_CALL_DEFAULT_PARTICIPANT_QUICK_COMMAND_STATE } from 'global-shared'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { RoomCallActiveParticipant, RoomCallActiveState } from '../room-calls.types'

const activeStateMock = vi.hoisted(() => ({
  removeActiveRoomCall: vi.fn(),
  transformActiveRoomCallToRoomCall: vi.fn((roomCall: unknown) => roomCall),
  updateActiveRoomCall: vi.fn()
}))

const historyMock = vi.hoisted(() => ({
  saveRoomCallHistory: vi.fn()
}))

const presenceUtilsMock = vi.hoisted(() => ({
  emitToUsers: vi.fn()
}))

vi.mock('./room-call-active-state', () => activeStateMock)
vi.mock('./room-call-history', () => historyMock)
vi.mock('src/modules/presence/presence.utils', () => presenceUtilsMock)

const { leaveRoomCallParticipant } = await import('./leave-room-call-participant')

const createRoomCallParticipant = (
  userId: string,
  socketId: string,
  joinedAt: number,
  leftAt?: number
): RoomCallActiveParticipant => ({
  joinedAt,
  leftAt,
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

const createRoomCall = (participants: RoomCallActiveParticipant[]): RoomCallActiveState => ({
  id: 'room-call-id',
  calledAt: 1,
  initiatorId: 'user-a',
  mediaKind: 'audio',
  participants,
  roomId: 'room-id',
  startedAt: 2,
  status: 'in-progress'
})

const mockRoomCallUpdate = (roomCall: RoomCallActiveState) => {
  let updatedRoomCall: RoomCallActiveState | null = null

  activeStateMock.updateActiveRoomCall.mockImplementation(
    async (
      _redisService: unknown,
      _roomCallId: string,
      resolveNextRoomCall: (roomCall: RoomCallActiveState) => RoomCallActiveState | null
    ) => {
      updatedRoomCall = resolveNextRoomCall(roomCall)

      return updatedRoomCall
    }
  )

  return () => updatedRoomCall
}

describe('leave-room-call-participant', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(100)

    activeStateMock.removeActiveRoomCall.mockResolvedValue(true)
    activeStateMock.transformActiveRoomCallToRoomCall.mockImplementation((roomCall: unknown) => roomCall)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('finishes a call when only one active participant would remain', async () => {
    const roomCall = createRoomCall([
      createRoomCallParticipant('user-a', 'socket-a', 1),
      createRoomCallParticipant('user-b', 'socket-b', 2),
      createRoomCallParticipant('user-c', 'socket-c', 3, 50)
    ])
    const getUpdatedRoomCall = mockRoomCallUpdate(roomCall)

    await leaveRoomCallParticipant({} as never, roomCall, 'user-b', 'socket-b', 'left')

    const updatedRoomCall = getUpdatedRoomCall()

    expect(updatedRoomCall?.status).toBe('finished')
    expect(updatedRoomCall?.finishedAt).toBe(100)
    expect(updatedRoomCall?.participants.find(({ userId }) => userId === 'user-a')?.leftAt).toBe(100)
    expect(updatedRoomCall?.participants.find(({ userId }) => userId === 'user-b')?.leftAt).toBe(100)
    expect(updatedRoomCall?.participants.find(({ userId }) => userId === 'user-c')?.leftAt).toBe(50)
    expect(historyMock.saveRoomCallHistory).toHaveBeenCalledWith(updatedRoomCall)
    expect(activeStateMock.removeActiveRoomCall).toHaveBeenCalledWith({}, updatedRoomCall)
    expect(presenceUtilsMock.emitToUsers).toHaveBeenNthCalledWith(1, ['user-a', 'user-b'], 'room-call-left', {
      leftAt: 100,
      reason: 'left',
      roomCallId: roomCall.id,
      userId: 'user-b'
    })
    expect(presenceUtilsMock.emitToUsers).toHaveBeenNthCalledWith(2, ['user-a', 'user-b'], 'room-call-ended', {
      finishedAt: 100,
      roomCallId: roomCall.id
    })
  })

  it('keeps a call active when more than one participant remains', async () => {
    const roomCall = createRoomCall([
      createRoomCallParticipant('user-a', 'socket-a', 1),
      createRoomCallParticipant('user-b', 'socket-b', 2),
      createRoomCallParticipant('user-c', 'socket-c', 3)
    ])
    const getUpdatedRoomCall = mockRoomCallUpdate(roomCall)

    await leaveRoomCallParticipant({} as never, roomCall, 'user-b', 'socket-b', 'left')

    const updatedRoomCall = getUpdatedRoomCall()

    expect(updatedRoomCall?.status).toBe('in-progress')
    expect(updatedRoomCall?.finishedAt).toBeUndefined()
    expect(updatedRoomCall?.participants.find(({ userId }) => userId === 'user-a')?.leftAt).toBeUndefined()
    expect(updatedRoomCall?.participants.find(({ userId }) => userId === 'user-b')?.leftAt).toBe(100)
    expect(updatedRoomCall?.participants.find(({ userId }) => userId === 'user-c')?.leftAt).toBeUndefined()
    expect(historyMock.saveRoomCallHistory).not.toHaveBeenCalled()
    expect(activeStateMock.removeActiveRoomCall).not.toHaveBeenCalled()
    expect(presenceUtilsMock.emitToUsers).toHaveBeenCalledTimes(1)
  })
})
