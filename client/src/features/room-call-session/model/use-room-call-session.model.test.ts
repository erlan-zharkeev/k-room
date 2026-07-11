import type { EventSendRoomCallSignal } from 'global-shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const roomCallMock = vi.hoisted(() => ({ remove: vi.fn() }))
const socketActionMock = vi.hoisted(() => ({ emitSocketAction: vi.fn() }))

vi.mock('src/entities/room-call', () => ({ useRoomCall: () => roomCallMock }))
vi.mock('src/shared/api', () => ({ useSocketAction: () => socketActionMock }))
vi.mock('@nmorph/nmorph-ui-kit', () => ({}))
vi.mock('../config/constants', () => ({
  ROOM_CALL_SIGNAL_ACK_TIMEOUT_MS: 8_000,
  ROOM_CALL_SIGNAL_SEND_ATTEMPTS: 3
}))

vi.stubGlobal('__CLIENT_ENV_DATA__', { appName: 'K-Room Test' })

const { useRoomCallSession } = await import('./use-room-call-session.model')

const signal: EventSendRoomCallSignal = {
  roomCallId: 'call-1',
  signal: { type: 'answer' },
  signalId: 'signal-1',
  signalKind: 'answer',
  toUserId: 'user-2'
}

describe('useRoomCallSession signaling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retries the same signal id until the recipient acknowledges delivery', async () => {
    socketActionMock.emitSocketAction.mockResolvedValueOnce({ ok: false }).mockResolvedValueOnce({ ok: true })
    const { sendRoomCallSignal } = useRoomCallSession()

    await expect(sendRoomCallSignal(signal)).resolves.toBe(true)
    expect(socketActionMock.emitSocketAction).toHaveBeenCalledTimes(2)
    expect(socketActionMock.emitSocketAction).toHaveBeenNthCalledWith(
      1,
      'send-room-call-signal',
      signal,
      expect.objectContaining({ showTransportErrorToast: false })
    )
    expect(socketActionMock.emitSocketAction).toHaveBeenNthCalledWith(
      2,
      'send-room-call-signal',
      signal,
      expect.objectContaining({ showTransportErrorToast: false })
    )
  })

  it('reports failure after all delivery attempts are exhausted', async () => {
    socketActionMock.emitSocketAction.mockResolvedValue({ ok: false })
    const { sendRoomCallSignal } = useRoomCallSession()

    await expect(sendRoomCallSignal(signal)).resolves.toBe(false)
    expect(socketActionMock.emitSocketAction).toHaveBeenCalledTimes(3)
  })
})
