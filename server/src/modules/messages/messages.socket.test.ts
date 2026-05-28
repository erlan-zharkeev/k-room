import { beforeEach, describe, expect, it, vi } from 'vitest'

const messagesServiceMock = vi.hoisted(() => ({
  sendMessage: vi.fn(),
  loadRoomMessages: vi.fn(),
  emitRoomTypingStatus: vi.fn(),
  changeMessageStatus: vi.fn(),
  markRoomAsRead: vi.fn(),
  updatePinnedMessage: vi.fn(),
  toggleMessageReaction: vi.fn(),
  deleteMessage: vi.fn()
}))

vi.mock('../../shared/lib/socket-error', () => ({
  socketAckMiddleware: (_socket: unknown, handler: unknown) => handler,
  socketErrorMiddleware: (_socket: unknown, handler: unknown) => handler
}))
vi.mock('./messages.service', () => messagesServiceMock)

const { MessagesSocketService } = await import('./messages.socket')

const registerMessagesSocketHandlers = (socket: never) => {
  new MessagesSocketService().register(socket)
}

describe('messages.socket', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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

  it('acks loaded room messages', async () => {
    const handlers: Record<string, (payload: never) => Promise<unknown>> = {}
    const payload = {
      roomId: 'room-1',
      messages: [{ id: 'message-1' }],
      rangeStartMessageId: 'message-1',
      rangeEndMessageId: 'message-1'
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

    const requestPayload = {
      roomId: 'room-1',
      limit: 20,
      direction: 'latest'
    }
    const response = await handlers['load-room-messages'](requestPayload as never)

    expect(messagesServiceMock.loadRoomMessages).toHaveBeenCalledWith('user-1', requestPayload)
    expect(response).toEqual({
      ok: true,
      payload
    })
  })

  it('acks failed room message load when room data is missing', async () => {
    const handlers: Record<string, (payload: never) => Promise<unknown>> = {}
    const socket = {
      id: 'socket-1',
      data: {
        userId: 'user-1',
        language: 'en'
      },
      on: vi.fn((event: string, handler: (payload: never) => Promise<unknown>) => {
        handlers[event] = handler
      })
    }

    messagesServiceMock.loadRoomMessages.mockResolvedValue(null)
    registerMessagesSocketHandlers(socket as never)

    const response = await handlers['load-room-messages']({ roomId: 'room-1', limit: 20, direction: 'latest' } as never)

    expect(response).toEqual({ ok: false })
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

  it('wires delete-message payload to service', async () => {
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
      deleteForEveryone: true,
      roomId: 'room-1',
      messageId: 'message-1'
    }

    registerMessagesSocketHandlers(socket as never)

    await handlers['delete-message'](payload as never)

    expect(messagesServiceMock.deleteMessage).toHaveBeenCalledWith('user-1', payload)
  })

  it('wires add-reaction payload to service', async () => {
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
      messageId: 'message-1',
      glyphKey: '\u{1F44D}'
    }

    registerMessagesSocketHandlers(socket as never)

    await handlers['add-reaction'](payload as never)

    expect(messagesServiceMock.toggleMessageReaction).toHaveBeenCalledWith('user-1', payload)
  })

  it('wires update-pinned-message payload to service', async () => {
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
      isPinned: true,
      roomId: 'room-1',
      messageId: 'message-1'
    }

    registerMessagesSocketHandlers(socket as never)

    await handlers['update-pinned-message'](payload as never)

    expect(messagesServiceMock.updatePinnedMessage).toHaveBeenCalledWith('user-1', payload)
  })
})
