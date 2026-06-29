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

const transportMetaMock = vi.hoisted(() => ({
  handleTransportMeta: vi.fn()
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
vi.mock('../transport-meta', () => transportMetaMock)

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
    const successMeta = { clientVersion: '0.1.18' }
    const failureMeta = { clientVersion: '0.1.19' }
    const successResponse = { ok: true, payload: { roomId: 'room-1' }, meta: successMeta }
    const failureResponse = { ok: false, reason: 'failed', meta: failureMeta }

    socketMock.emitWithAck.mockResolvedValueOnce(successResponse).mockResolvedValueOnce(failureResponse)

    await expect(
      emitSocketAction('update-pinned-chat-room', { roomId: 'room-1', isPinned: true }, { onSuccess })
    ).resolves.toBe(successResponse)
    await expect(
      emitSocketAction('update-pinned-chat-room', { roomId: 'room-1', isPinned: true }, { onFailure })
    ).resolves.toBe(failureResponse)

    expect(socketMock.timeout).toHaveBeenCalledWith(expect.any(Number))
    expect(transportMetaMock.handleTransportMeta).toHaveBeenNthCalledWith(1, successMeta)
    expect(transportMetaMock.handleTransportMeta).toHaveBeenNthCalledWith(2, failureMeta)
    expect(onSuccess).toHaveBeenCalledWith(successResponse)
    expect(onFailure).toHaveBeenCalledWith(failureResponse)
  })

  it('does not send undefined payload for ack actions without payload', async () => {
    const { emitSocketAction } = useSocketAction()
    const response = { ok: true, payload: { roomId: 'support-room-1' } }

    socketMock.emitWithAck.mockResolvedValue(response)

    await expect(emitSocketAction('open-support-chat', undefined)).resolves.toBe(response)

    expect(socketMock.emitWithAck).toHaveBeenCalledWith('open-support-chat')
  })
})
