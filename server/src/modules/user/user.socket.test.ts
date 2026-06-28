import { beforeEach, describe, expect, it, vi } from 'vitest'

const actualUserSocketDataMock = vi.hoisted(() => ({
  resolveActualUserSocketData: vi.fn()
}))

vi.mock('src/shared/lib/socket-error', () => ({
  socketErrorMiddleware: (_socket: unknown, handler: unknown) => handler
}))
vi.mock('./lib/resolve-actual-user-socket-data', () => actualUserSocketDataMock)

const { UserSocketService } = await import('./user.socket')

const registerUserHandlers = async () => {
  const handlers: Record<string, (payload?: never) => Promise<unknown>> = {}
  const socket = {
    id: 'socket-1',
    data: {
      userId: 'user-1',
      language: 'en'
    },
    emit: vi.fn(),
    on: vi.fn((event: string, handler: (payload?: never) => Promise<unknown>) => {
      handlers[event] = handler
    })
  }
  const presenceService = {
    markSocketDisconnected: vi.fn()
  }
  const redisService = {}
  const userService = {
    updateUserLanguage: vi.fn()
  }

  await new UserSocketService(presenceService as never, redisService as never, userService as never).register(
    socket as never
  )

  return {
    handlers,
    presenceService,
    redisService,
    socket,
    userService
  }
}

describe('user.socket', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('marks socket disconnected through presence service', async () => {
    const { handlers, presenceService, socket } = await registerUserHandlers()

    await handlers.disconnect()

    expect(presenceService.markSocketDisconnected).toHaveBeenCalledWith(socket)
  })

  it('updates socket language in socket data', async () => {
    const { handlers, socket, userService } = await registerUserHandlers()

    await handlers['update-language']({ language: 'ru' } as never)

    expect(socket.data.language).toBe('ru')
    expect(userService.updateUserLanguage).toHaveBeenLastCalledWith('user-1', 'ru')
  })

  it('saves socket language when socket is registered', async () => {
    const { userService } = await registerUserHandlers()

    expect(userService.updateUserLanguage).toHaveBeenCalledWith('user-1', 'en')
  })

  it('actualizes contacts, rooms, and room calls when user data is available', async () => {
    const { handlers, redisService, socket } = await registerUserHandlers()
    const payload = {
      contactsPayload: { contacts: [] },
      roomsPayload: { rooms: [] },
      roomCallsPayload: { roomCalls: [] }
    }

    actualUserSocketDataMock.resolveActualUserSocketData.mockResolvedValue(payload)

    await handlers['actualize-user-data']()

    expect(actualUserSocketDataMock.resolveActualUserSocketData).toHaveBeenCalledWith(
      'user-1',
      expect.any(Object),
      redisService
    )
    expect(socket.emit).toHaveBeenCalledWith(
      'actual-contacts',
      payload.contactsPayload,
      expect.objectContaining({ clientVersion: expect.any(String) })
    )
    expect(socket.emit).toHaveBeenCalledWith(
      'actual-chat-rooms',
      payload.roomsPayload,
      expect.objectContaining({ clientVersion: expect.any(String) })
    )
    expect(socket.emit).toHaveBeenCalledWith(
      'room-calls-updated',
      payload.roomCallsPayload,
      expect.objectContaining({ clientVersion: expect.any(String) })
    )
  })
})
