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

const { registerSocketEventListeners } = await import('./event-listeners')

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
})
