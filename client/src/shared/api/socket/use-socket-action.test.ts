import { beforeEach, describe, expect, it, vi } from 'vitest'

const socketMock = vi.hoisted(() => ({
  emitWithAck: vi.fn(),
  timeout: vi.fn()
}))

const socketAvailabilityMock = vi.hoisted(() => ({
  isSocketOnlineActionAvailable: { value: true }
}))

const socketToastMock = vi.hoisted(() => ({
  showSocketTransportErrorToast: vi.fn()
}))

vi.mock('./socket', () => ({
  socket: socketMock
}))
vi.mock('./use-socket-availability.model', () => ({
  useSocketAvailability: () => socketAvailabilityMock
}))
vi.mock('./use-socket-transport-error-toast', () => ({
  useSocketTransportErrorToast: () => socketToastMock
}))

const { useSocketAction } = await import('./use-socket-action')

describe('useSocketAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    socketAvailabilityMock.isSocketOnlineActionAvailable.value = true
    socketMock.timeout.mockReturnValue(socketMock)
  })

  it('returns transport failure when socket actions are unavailable', async () => {
    const { emitSocketAction } = useSocketAction()
    const onFailure = vi.fn()
    const onSettled = vi.fn()

    socketAvailabilityMock.isSocketOnlineActionAvailable.value = false

    const response = await emitSocketAction('mark-room-as-read', { roomId: 'room-1' }, { onFailure, onSettled })

    expect(response).toEqual({
      ok: false,
      handledByGlobalError: true
    })
    expect(socketToastMock.showSocketTransportErrorToast).toHaveBeenCalled()
    expect(onFailure).toHaveBeenCalledWith(response)
    expect(onSettled).toHaveBeenCalled()
  })

  it('routes socket ack success and failure callbacks', async () => {
    const { emitSocketAction } = useSocketAction()
    const onSuccess = vi.fn()
    const onFailure = vi.fn()
    const successResponse = { ok: true, payload: { roomId: 'room-1' } }
    const failureResponse = { ok: false, reason: 'failed' }

    socketMock.emitWithAck.mockResolvedValueOnce(successResponse).mockResolvedValueOnce(failureResponse)

    await expect(
      emitSocketAction('update-pinned-chat-room', { roomId: 'room-1', isPinned: true }, { onSuccess })
    ).resolves.toBe(successResponse)
    await expect(
      emitSocketAction('update-pinned-chat-room', { roomId: 'room-1', isPinned: true }, { onFailure })
    ).resolves.toBe(failureResponse)

    expect(socketMock.timeout).toHaveBeenCalledWith(expect.any(Number))
    expect(onSuccess).toHaveBeenCalledWith(successResponse)
    expect(onFailure).toHaveBeenCalledWith(failureResponse)
  })
})
