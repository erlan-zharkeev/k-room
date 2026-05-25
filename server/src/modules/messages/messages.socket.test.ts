import { beforeEach, describe, expect, it, vi } from 'vitest'

const ioMock = vi.hoisted(() => ({
  emit: vi.fn(),
  to: vi.fn()
}))

const messagesServiceMock = vi.hoisted(() => ({
  sendMessage: vi.fn(),
  loadRoomMessages: vi.fn(),
  emitRoomTypingStatus: vi.fn(),
  changeMessageStatus: vi.fn(),
  markRoomAsRead: vi.fn()
}))

vi.mock('../../shared/lib/io', () => ({
  getIO: () => ioMock
}))
vi.mock('../../shared/lib/socket-error', () => ({
  socketAckMiddleware: (_socket: unknown, handler: unknown) => handler,
  socketErrorMiddleware: (_socket: unknown, handler: unknown) => handler
}))
vi.mock('./messages.service', () => messagesServiceMock)

const { registerMessagesSocketHandlers } = await import('./messages.socket')

describe('messages.socket', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ioMock.to.mockReturnValue({ emit: ioMock.emit })
  })

  it('wires send-message payload to service', async () => {
    const handlers: Record<string, (payload: never) => Promise<void>> = {}
    const socket = {
      id: 'socket-1',
      data: {
        userId: 'user-1',
        language: 'ru'
      },
      on: vi.fn((event: string, handler: (payload: never) => Promise<void>) => {
        handlers[event] = handler
      })
    }

    registerMessagesSocketHandlers(socket as never)

    await handlers['send-message']({
      roomId: 'room-1',
      message: {
        id: 'message-1',
        authorId: 'user-1',
        authorNickname: 'tester',
        body: 'hello',
        createdAt: 1,
        images: [],
        reactions: [],
        isSelf: true
      }
    } as never)

    expect(messagesServiceMock.sendMessage).toHaveBeenCalledWith({
      roomId: 'room-1',
      message: expect.objectContaining({ id: 'message-1' })
    })
  })

  it('emits loaded room messages only to requester socket', async () => {
    const handlers: Record<string, (payload: never) => Promise<void>> = {}
    const payload = {
      roomId: 'room-1',
      messages: [{ id: 'message-1' }],
      hasMore: false,
      nextBeforeCreatedAt: 1
    }
    const socket = {
      id: 'socket-1',
      data: {
        userId: 'user-1',
        language: 'en'
      },
      on: vi.fn((event: string, handler: (payload: never) => Promise<void>) => {
        handlers[event] = handler
      })
    }

    messagesServiceMock.loadRoomMessages.mockResolvedValue(payload)
    registerMessagesSocketHandlers(socket as never)

    await handlers['load-room-messages']({ roomId: 'room-1', limit: 20 } as never)

    expect(messagesServiceMock.loadRoomMessages).toHaveBeenCalledWith('user-1', { roomId: 'room-1', limit: 20 })
    expect(ioMock.to).toHaveBeenCalledWith('socket-1')
    expect(ioMock.emit).toHaveBeenCalledWith('room-messages-loaded', payload)
  })

  it('wires client-typing payload to service', async () => {
    const handlers: Record<string, (payload: never) => Promise<void>> = {}
    const socket = {
      id: 'socket-1',
      data: {
        userId: 'user-1',
        language: 'en'
      },
      on: vi.fn((event: string, handler: (payload: never) => Promise<void>) => {
        handlers[event] = handler
      })
    }
    const payload = {
      roomId: 'room-1',
      isTyping: true
    }

    registerMessagesSocketHandlers(socket as never)

    await handlers['client-typing'](payload as never)

    expect(messagesServiceMock.emitRoomTypingStatus).toHaveBeenCalledWith('user-1', payload)
  })
})
