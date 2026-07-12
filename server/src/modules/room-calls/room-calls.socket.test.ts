import { beforeEach, describe, expect, it, vi } from 'vitest'

const activeStateMock = vi.hoisted(() => ({
  saveRoomCallServerInstanceHeartbeat: vi.fn()
}))

const cleanupMock = vi.hoisted(() => ({
  cleanupStaleRoomCallParticipants: vi.fn()
}))

const roomCallsServiceMock = vi.hoisted(() => ({
  declineRoomCall: vi.fn(),
  joinRoomCall: vi.fn(),
  leaveActiveRoomCallsBySocket: vi.fn(),
  leaveRoomCall: vi.fn(),
  loadRoomCalls: vi.fn(),
  markRoomCallsAsSeen: vi.fn(),
  sendRoomCallQuickCommand: vi.fn(),
  sendRoomCallSignal: vi.fn(),
  setRoomCallHandRaised: vi.fn(),
  startRoomCall: vi.fn(),
  updateRoomCallMediaState: vi.fn()
}))

vi.mock('src/shared/lib/socket-error', () => ({
  socketAckMiddleware: (_socket: unknown, handler: unknown) => handler,
  socketErrorMiddleware: (_socket: unknown, handler: unknown) => handler
}))
vi.mock('./lib/room-call-active-state', () => activeStateMock)
vi.mock('./lib/cleanup-stale-room-call-participants', () => cleanupMock)
vi.mock('./room-calls.service', () => roomCallsServiceMock)

const { RoomCallsSocketService } = await import('./room-calls.socket')

const registerRoomCallHandlers = () => {
  const handlers: Record<string, (payload?: never) => Promise<unknown>> = {}
  const socket = {
    id: 'socket-1',
    data: {
      userId: 'user-1'
    },
    on: vi.fn((event: string, handler: (payload?: never) => Promise<unknown>) => {
      handlers[event] = handler
    })
  }
  const notificationsService = {}
  const redisService = {}

  new RoomCallsSocketService(notificationsService as never, redisService as never).register(socket as never)

  return {
    handlers,
    notificationsService,
    redisService
  }
}

describe('room-calls.socket', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts heartbeat and stale cleanup timers on module init', async () => {
    vi.useFakeTimers()

    const redisService = {}
    const service = new RoomCallsSocketService({} as never, redisService as never)

    await service.onModuleInit()

    expect(activeStateMock.saveRoomCallServerInstanceHeartbeat).toHaveBeenCalledWith(redisService, expect.any(String))
    expect(cleanupMock.cleanupStaleRoomCallParticipants).toHaveBeenCalledWith(redisService)

    service.onModuleDestroy()
    vi.useRealTimers()
  })

  it('acks started room call payload', async () => {
    const { handlers, notificationsService, redisService } = registerRoomCallHandlers()
    const result = {
      roomCall: {
        id: 'call-1',
        calledAt: 1,
        initiatorId: 'user-1',
        mediaKind: 'video',
        participants: [],
        roomId: 'room-1',
        status: 'calling'
      },
      roomCallId: 'call-1'
    }

    roomCallsServiceMock.startRoomCall.mockResolvedValue(result)

    const response = await handlers['start-room-call']({ roomId: 'room-1', mediaKind: 'video' } as never)

    expect(roomCallsServiceMock.startRoomCall).toHaveBeenCalledWith(
      redisService,
      'user-1',
      'socket-1',
      expect.any(String),
      notificationsService,
      { roomId: 'room-1', mediaKind: 'video' }
    )
    expect(response).toEqual({
      ok: true,
      payload: result
    })
  })

  it('returns join failure ack when join service returns empty result', async () => {
    const { handlers } = registerRoomCallHandlers()

    roomCallsServiceMock.joinRoomCall.mockResolvedValue(null)

    const response = await handlers['join-room-call']({ roomCallId: 'call-1', mediaKind: 'audio' } as never)

    expect(response).toEqual({
      ok: false,
      reason: 'join-failed'
    })
  })

  it('returns a regular failure ack when a call signal is not delivered', async () => {
    const { handlers } = registerRoomCallHandlers()

    roomCallsServiceMock.sendRoomCallSignal.mockResolvedValue(false)

    const response = await handlers['send-room-call-signal']({ roomCallId: 'call-1', signalId: 'signal-1' } as never)

    expect(response).toEqual({ ok: false })
  })

  it('wires call actions and disconnect cleanup to service layer', async () => {
    const { handlers, redisService } = registerRoomCallHandlers()

    await handlers['leave-room-call']({ roomCallId: 'call-1' } as never)
    await handlers['load-room-calls']({ roomIds: ['room-1'] } as never)
    await handlers['decline-room-call']({ roomCallId: 'call-1' } as never)
    await handlers['mark-room-calls-as-seen']({ lastSeenMissedRoomCallCalledAt: 100 } as never)
    await handlers['update-room-call-media-state']({ roomCallId: 'call-1' } as never)
    await handlers['send-room-call-quick-command']({ roomCallId: 'call-1' } as never)
    await handlers['set-room-call-hand-raised']({ roomCallId: 'call-1' } as never)
    await handlers['send-room-call-signal']({ roomCallId: 'call-1' } as never)
    await handlers.disconnect()

    expect(roomCallsServiceMock.leaveRoomCall).toHaveBeenCalledWith(redisService, 'user-1', 'socket-1', {
      roomCallId: 'call-1'
    })
    expect(roomCallsServiceMock.loadRoomCalls).toHaveBeenCalledWith(redisService, 'user-1', { roomIds: ['room-1'] })
    expect(roomCallsServiceMock.declineRoomCall).toHaveBeenCalledWith(redisService, 'user-1', { roomCallId: 'call-1' })
    expect(roomCallsServiceMock.markRoomCallsAsSeen).toHaveBeenCalledWith('user-1', {
      lastSeenMissedRoomCallCalledAt: 100
    })
    expect(roomCallsServiceMock.updateRoomCallMediaState).toHaveBeenCalledWith(redisService, 'user-1', 'socket-1', {
      roomCallId: 'call-1'
    })
    expect(roomCallsServiceMock.sendRoomCallQuickCommand).toHaveBeenCalledWith(redisService, 'user-1', 'socket-1', {
      roomCallId: 'call-1'
    })
    expect(roomCallsServiceMock.setRoomCallHandRaised).toHaveBeenCalledWith(redisService, 'user-1', 'socket-1', {
      roomCallId: 'call-1'
    })
    expect(roomCallsServiceMock.sendRoomCallSignal).toHaveBeenCalledWith(
      redisService,
      'user-1',
      'socket-1',
      expect.objectContaining({
        roomCallId: 'call-1',
        signalId: expect.any(String)
      })
    )
    expect(roomCallsServiceMock.leaveActiveRoomCallsBySocket).toHaveBeenCalledWith(redisService, 'user-1', 'socket-1')
  })
})
