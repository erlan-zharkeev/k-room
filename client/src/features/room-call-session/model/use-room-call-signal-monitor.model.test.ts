import type { EventRoomCallSignalReceived } from 'global-shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const socketApiMock = vi.hoisted(() => ({
  registerSocketAckEventListeners: vi.fn()
}))
const diagnosticsMock = vi.hoisted(() => ({
  buildRoomCallErrorDiagnostics: vi.fn(() => ({ name: 'Error' })),
  buildRoomCallSignalDiagnostics: vi.fn(() => ({ present: true })),
  captureRoomCallDiagnostic: vi.fn()
}))

vi.mock('src/shared/api', () => socketApiMock)
vi.mock('@nmorph/nmorph-ui-kit', () => ({}))
vi.mock('../config/constants', () => ({ ROOM_CALL_HANDLED_SIGNAL_ID_LIMIT: 1_000 }))
vi.mock('../lib/room-call-sentry-diagnostics', () => diagnosticsMock)

vi.stubGlobal('__CLIENT_ENV_DATA__', { appName: 'K-Room Test' })

const { useRoomCallSignalMonitor } = await import('./use-room-call-signal-monitor.model')

const signal: EventRoomCallSignalReceived = {
  fromUserId: 'user-1',
  roomCallId: 'call-1',
  signal: { type: 'offer' },
  signalId: 'signal-1',
  signalKind: 'offer'
}

describe('useRoomCallSignalMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    socketApiMock.registerSocketAckEventListeners.mockReturnValue(vi.fn())
  })

  it('deduplicates concurrent and completed signal deliveries by signal id', async () => {
    let finishSignalProcessing: (() => void) | undefined
    const signalProcessingTask = new Promise<void>((resolve) => {
      finishSignalProcessing = resolve
    })
    const handleRoomCallSignalReceived = vi.fn(() => signalProcessingTask)
    const { initializeRoomCallSignalMonitor } = useRoomCallSignalMonitor(handleRoomCallSignalReceived)

    initializeRoomCallSignalMonitor()

    const listeners = socketApiMock.registerSocketAckEventListeners.mock.calls[0]?.[0]
    const listener = listeners[0][1] as (payload: EventRoomCallSignalReceived) => Promise<void>

    await expect(listener(signal)).resolves.toBeUndefined()
    await expect(listener(signal)).resolves.toBeUndefined()
    expect(handleRoomCallSignalReceived).toHaveBeenCalledTimes(1)

    finishSignalProcessing?.()
    await signalProcessingTask
    await Promise.resolve()
    await listener(signal)

    expect(handleRoomCallSignalReceived).toHaveBeenCalledTimes(1)
  })

  it('allows a failed signal to be retried', async () => {
    const handleRoomCallSignalReceived = vi
      .fn<(payload: EventRoomCallSignalReceived) => Promise<void>>()
      .mockRejectedValueOnce(new Error('failed'))
      .mockResolvedValueOnce(undefined)
    const { initializeRoomCallSignalMonitor } = useRoomCallSignalMonitor(handleRoomCallSignalReceived)

    initializeRoomCallSignalMonitor()

    const listeners = socketApiMock.registerSocketAckEventListeners.mock.calls[0]?.[0]
    const listener = listeners[0][1] as (payload: EventRoomCallSignalReceived) => Promise<void>

    await expect(listener(signal)).resolves.toBeUndefined()
    await Promise.resolve()
    await expect(listener(signal)).resolves.toBeUndefined()
    await Promise.resolve()
    expect(handleRoomCallSignalReceived).toHaveBeenCalledTimes(2)
    expect(diagnosticsMock.captureRoomCallDiagnostic).toHaveBeenCalledWith(
      'active-session-signal-processing-failed',
      expect.objectContaining({ signalId: 'signal-1' }),
      'error'
    )
  })
})
