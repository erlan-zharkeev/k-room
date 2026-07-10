import { beforeEach, describe, expect, it, vi } from 'vitest'

interface SentryScopeMock {
  setContext: (name: string, context: unknown) => void
  setTag: (key: string, value: string) => void
}

const socketMock = vi.hoisted(() => {
  const handlers = new Map<string, (...args: never[]) => void>()

  return {
    handlers,
    off: vi.fn(),
    on: vi.fn((event: string, handler: (...args: never[]) => void) => {
      handlers.set(event, handler)
    })
  }
})

const sentryMock = vi.hoisted(() => {
  const scope = {
    setContext: vi.fn(),
    setTag: vi.fn()
  }

  return {
    captureClientSentryException: vi.fn(),
    scope,
    withClientSentryScope: vi.fn((callback: (scope: SentryScopeMock) => void) => {
      callback(scope)
    })
  }
})

const transportMetaMock = vi.hoisted(() => ({
  handleTransportMeta: vi.fn()
}))

vi.mock('./socket', () => ({ socket: socketMock }))
vi.mock('src/shared/lib', () => sentryMock)
vi.mock('../transport-meta', () => transportMetaMock)

const { registerSocketAckEventListeners, registerSocketEventListeners } = await import('./event-listeners')

describe('event-listeners', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    socketMock.handlers.clear()
  })

  it('captures async socket listener errors with socket event context', async () => {
    const error = new Error('listener failed')
    const listener = vi.fn(async () => {
      throw error
    })

    registerSocketEventListeners([['message-delivered', listener as never]])

    socketMock.handlers.get('message-delivered')?.({} as never)
    await Promise.resolve()

    expect(sentryMock.scope.setTag).toHaveBeenCalledWith('socket.event', 'message-delivered')
    expect(sentryMock.scope.setContext).toHaveBeenCalledWith('socket_event_listener', {
      event: 'message-delivered'
    })
    expect(sentryMock.captureClientSentryException).toHaveBeenCalledWith(error)
  })

  it('captures sync socket listener errors with socket event context', () => {
    const error = new Error('listener failed')
    const listener = vi.fn(() => {
      throw error
    })

    registerSocketEventListeners([['message-delivered', listener as never]])

    socketMock.handlers.get('message-delivered')?.({} as never)

    expect(sentryMock.captureClientSentryException).toHaveBeenCalledWith(error)
  })

  it('acknowledges a reliably handled socket event', async () => {
    const listener = vi.fn(async () => undefined)
    const ack = vi.fn()

    registerSocketAckEventListeners([['room-call-signal-received', listener]])

    const handler = socketMock.handlers.get('room-call-signal-received') as unknown as (
      payload: unknown,
      meta: unknown,
      ack: (delivered: true) => void
    ) => Promise<void>

    await handler({ signalId: 'signal-1' }, { serverTime: 1 }, ack)

    expect(listener).toHaveBeenCalledWith({ signalId: 'signal-1' })
    expect(transportMetaMock.handleTransportMeta).toHaveBeenCalledWith({ serverTime: 1 })
    expect(ack).toHaveBeenCalledWith(true)
  })

  it('does not acknowledge a socket event rejected by its listener', async () => {
    const error = new Error('listener failed')
    const listener = vi.fn(async () => {
      throw error
    })
    const ack = vi.fn()

    registerSocketAckEventListeners([['room-call-signal-received', listener]])

    const handler = socketMock.handlers.get('room-call-signal-received') as unknown as (
      payload: unknown,
      meta: unknown,
      ack: (delivered: true) => void
    ) => Promise<void>

    await handler({ signalId: 'signal-1' }, { serverTime: 1 }, ack)

    expect(ack).not.toHaveBeenCalled()
    expect(sentryMock.captureClientSentryException).toHaveBeenCalledWith(error)
  })
})
