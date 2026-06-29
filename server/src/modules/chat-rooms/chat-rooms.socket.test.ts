import { beforeEach, describe, expect, it, vi } from 'vitest'

const chatRoomsServiceMock = vi.hoisted(() => ({
  closeSupportChat: vi.fn(),
  createChatRoom: vi.fn(),
  deleteChatRoom: vi.fn(),
  leaveChatRoom: vi.fn(),
  openSupportChat: vi.fn(),
  updateChatRoom: vi.fn(),
  updateMutedChatRoom: vi.fn(),
  updatePinnedChatRoom: vi.fn(),
  updatePinnedChatRoomOrder: vi.fn()
}))

vi.mock('src/shared/lib/socket-error', () => ({
  socketAckMiddleware: (_socket: unknown, handler: unknown) => handler,
  socketErrorMiddleware: (_socket: unknown, handler: unknown) => handler
}))
vi.mock('./chat-rooms.service', () => chatRoomsServiceMock)

const { ChatRoomsSocketService } = await import('./chat-rooms.socket')

const registerChatRoomHandlers = () => {
  const handlers: Record<string, (payload: never) => Promise<unknown>> = {}
  const socket = {
    data: {
      userId: 'user-1'
    },
    on: vi.fn((event: string, handler: (payload: never) => Promise<unknown>) => {
      handlers[event] = handler
    })
  }
  const presenceService = {}

  new ChatRoomsSocketService(presenceService as never).register(socket as never)

  return {
    handlers,
    presenceService
  }
}

describe('chat-rooms.socket', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('acks created room payload', async () => {
    const { handlers, presenceService } = registerChatRoomHandlers()

    chatRoomsServiceMock.createChatRoom.mockResolvedValue({ roomId: 'room-1' })

    const payload = { memberIds: ['user-2'] }
    const response = await handlers['create-chat-room'](payload as never)

    expect(chatRoomsServiceMock.createChatRoom).toHaveBeenCalledWith('user-1', payload, presenceService)
    expect(response).toEqual({
      ok: true,
      payload: {
        roomId: 'room-1'
      }
    })
  })

  it('wires update, delete, leave, pin, order, and mute events to service layer', async () => {
    const { handlers, presenceService } = registerChatRoomHandlers()

    await handlers['update-chat-room']({ roomId: 'room-1' } as never)
    await handlers['delete-chat-room']({ roomId: 'room-1' } as never)
    await handlers['leave-chat-room']({ roomId: 'room-1' } as never)
    await handlers['update-pinned-chat-room']({ roomId: 'room-1', isPinned: true } as never)
    await handlers['update-pinned-chat-room-order']({ pinnedChatRoomIds: ['room-1'] } as never)
    await handlers['update-muted-chat-room']({ roomId: 'room-1', isMuted: true } as never)

    expect(chatRoomsServiceMock.updateChatRoom).toHaveBeenCalledWith('user-1', { roomId: 'room-1' }, presenceService)
    expect(chatRoomsServiceMock.deleteChatRoom).toHaveBeenCalledWith('user-1', { roomId: 'room-1' })
    expect(chatRoomsServiceMock.leaveChatRoom).toHaveBeenCalledWith('user-1', { roomId: 'room-1' }, presenceService)
    expect(chatRoomsServiceMock.updatePinnedChatRoom).toHaveBeenCalledWith('user-1', {
      roomId: 'room-1',
      isPinned: true
    })
    expect(chatRoomsServiceMock.updatePinnedChatRoomOrder).toHaveBeenCalledWith('user-1', {
      pinnedChatRoomIds: ['room-1']
    })
    expect(chatRoomsServiceMock.updateMutedChatRoom).toHaveBeenCalledWith('user-1', {
      roomId: 'room-1',
      isMuted: true
    })
  })

  it('wires support chat events to service layer', async () => {
    const { handlers, presenceService } = registerChatRoomHandlers()

    chatRoomsServiceMock.openSupportChat.mockResolvedValue({ roomId: 'support-room-1' })

    const openResponse = await handlers['open-support-chat'](undefined as never)
    await handlers['close-support-chat']({ roomId: 'support-room-1' } as never)

    expect(chatRoomsServiceMock.openSupportChat).toHaveBeenCalledWith('user-1', presenceService)
    expect(openResponse).toEqual({
      ok: true,
      payload: {
        roomId: 'support-room-1'
      }
    })
    expect(chatRoomsServiceMock.closeSupportChat).toHaveBeenCalledWith(
      'user-1',
      { roomId: 'support-room-1' },
      presenceService
    )
  })
})
