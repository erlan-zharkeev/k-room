import type { ChatRoom } from 'global-shared'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type * as VueModule from 'vue'
import { nextTick, ref } from 'vue'

import { CHAT_ROOM_TYPING_IDLE_TIMEOUT_MS } from '../config/constants'

const socketMock = vi.hoisted(() => ({
  emit: vi.fn()
}))

const contactStoreMock = vi.hoisted(() => ({
  contactById: { value: new Map([['user-2', { nickname: 'alice' }]]) }
}))

const knownUserStoreMock = vi.hoisted(() => ({
  knownUserById: { value: new Map([['user-3', { nickname: 'bob' }]]) }
}))

vi.mock('vue', async (importOriginal) => ({
  ...(await importOriginal<typeof VueModule>()),
  onBeforeUnmount: vi.fn()
}))

vi.mock('src/shared/api', () => ({
  socket: socketMock,
  useSocketAvailability: () => ({
    isSocketOnlineActionAvailable: { value: true }
  })
}))

vi.mock('src/entities/contact', () => ({
  useContact: () => contactStoreMock
}))

vi.mock('src/entities/known-user', () => ({
  useKnownUser: () => knownUserStoreMock
}))

vi.mock('src/shared/lib', () => ({
  defineI18n: (namespace: string, source: Record<string, unknown>) =>
    Object.fromEntries(Object.keys(source).map((key) => [key, `${namespace}.${key}`])),
  i18nFormatter: () => '',
  useI18n: () => ({
    t: (_key: string, named?: { names?: string[] }) => `${named?.names?.join(', ')} typing`
  })
}))

const { useChatRoomTypingEmitter } = await import('./use-chat-room-typing-emitter.model')
const { updateRoomTypingStatus } = await import('./chat-room-typing-status.store.model')
const { useChatRoomTypingStatus } = await import('./use-chat-room-typing.model')

const createRoom = (id: string): ChatRoom => ({ id, messages: [], users: [] } as unknown as ChatRoom)

describe('chat room typing status', () => {
  it('deduplicates typing users and removes empty room state', () => {
    const roomId = 'typing-room-1'
    const { typingText } = useChatRoomTypingStatus({ roomId })

    updateRoomTypingStatus({ roomId, contactId: 'user-2', isTyping: true })
    updateRoomTypingStatus({ roomId, contactId: 'user-2', isTyping: true })
    updateRoomTypingStatus({ roomId, contactId: 'user-3', isTyping: true })

    expect(typingText.value).toBe('alice, bob typing')

    updateRoomTypingStatus({ roomId, contactId: 'user-2', isTyping: false })
    updateRoomTypingStatus({ roomId, contactId: 'user-3', isTyping: false })

    expect(typingText.value).toBe('')
  })
})

describe('useChatRoomTypingEmitter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('emits typing start once and stops after idle timeout', async () => {
    const room = ref(createRoom('typing-room-2'))
    const messageText = ref('')

    useChatRoomTypingEmitter(room, messageText)

    messageText.value = 'h'
    await nextTick()
    messageText.value = 'hi'
    await nextTick()

    expect(socketMock.emit).toHaveBeenCalledTimes(1)
    expect(socketMock.emit).toHaveBeenCalledWith('client-typing', { roomId: 'typing-room-2', isTyping: true })

    vi.advanceTimersByTime(CHAT_ROOM_TYPING_IDLE_TIMEOUT_MS)

    expect(socketMock.emit).toHaveBeenCalledWith('client-typing', { roomId: 'typing-room-2', isTyping: false })
  })

  it('stops typing in the previous room when room changes', async () => {
    const room = ref(createRoom('typing-room-3'))
    const messageText = ref('')

    useChatRoomTypingEmitter(room, messageText)

    messageText.value = 'hello'
    await nextTick()
    room.value = createRoom('typing-room-4')
    await nextTick()

    expect(socketMock.emit).toHaveBeenCalledWith('client-typing', { roomId: 'typing-room-3', isTyping: false })
  })
})
