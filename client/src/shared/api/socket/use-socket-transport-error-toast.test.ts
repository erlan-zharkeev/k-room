import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const toastMock = vi.hoisted(() => ({
  add: vi.fn(),
  remove: vi.fn()
}))

const TEST_SOCKET_TRANSPORT_ERROR_TOAST_DELAY_MS = 5
const TEST_SOCKET_TRANSPORT_ERROR_TOAST_THROTTLE_MS = 5
const TEST_SOCKET_TRANSPORT_ERROR_TOAST_ID = 'socket-transport-error'

vi.mock('src/shared/lib', () => ({
  TOAST_I18N: {
    error: {
      en: 'Error',
      ru: 'Error',
      zh: 'Error'
    }
  },
  defineI18n: (_namespace: string, values: unknown) => values,
  useAppToast: () => toastMock,
  useI18n: () => ({
    t: (value: unknown) => {
      if (typeof value === 'string') return value

      return (value as { en: string }).en
    }
  })
}))

const loadSocketTransportErrorToast = async () => {
  vi.doMock('./constants', () => ({
    SOCKET_ACTION_ACK_TIMEOUT_MS: 1,
    SOCKET_MAX_RECONNECTION_DELAY_MS: 1,
    SOCKET_RECONNECTION_DELAY_MS: 1,
    SOCKET_TRANSPORT_ERROR_TOAST_DELAY_MS: TEST_SOCKET_TRANSPORT_ERROR_TOAST_DELAY_MS,
    SOCKET_TRANSPORT_ERROR_TOAST_ID: TEST_SOCKET_TRANSPORT_ERROR_TOAST_ID,
    SOCKET_TRANSPORT_ERROR_TOAST_THROTTLE_MS: TEST_SOCKET_TRANSPORT_ERROR_TOAST_THROTTLE_MS
  }))

  const { setSocketConnected } = await import('./socket-status')
  const constants = await import('./constants')
  const { useSocketTransportErrorToast } = await import('./use-socket-transport-error-toast')

  return {
    setSocketConnected,
    useSocketTransportErrorToast,
    socketTransportErrorToastDelayMs: constants.SOCKET_TRANSPORT_ERROR_TOAST_DELAY_MS,
    socketTransportErrorToastId: constants.SOCKET_TRANSPORT_ERROR_TOAST_ID
  }
}

describe('useSocketTransportErrorToast', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.useFakeTimers()
    vi.setSystemTime(10_000)
    toastMock.add.mockReset()
    toastMock.remove.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('delays the transport error toast while the socket is unavailable', async () => {
    const { socketTransportErrorToastDelayMs, socketTransportErrorToastId, useSocketTransportErrorToast } =
      await loadSocketTransportErrorToast()
    const { showSocketTransportErrorToast } = useSocketTransportErrorToast()

    showSocketTransportErrorToast()

    expect(toastMock.add).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(socketTransportErrorToastDelayMs - 1)

    expect(toastMock.add).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)

    expect(toastMock.add).toHaveBeenCalledWith(
      expect.objectContaining({
        id: socketTransportErrorToastId,
        type: 'error'
      })
    )
  })

  it('cancels a pending transport error toast when connection is restored', async () => {
    const { setSocketConnected, socketTransportErrorToastDelayMs, useSocketTransportErrorToast } =
      await loadSocketTransportErrorToast()
    const { hideSocketTransportErrorToast, showSocketTransportErrorToast } = useSocketTransportErrorToast()

    showSocketTransportErrorToast()
    setSocketConnected(true)
    hideSocketTransportErrorToast()
    await vi.advanceTimersByTimeAsync(socketTransportErrorToastDelayMs)

    expect(toastMock.add).not.toHaveBeenCalled()
    expect(toastMock.remove).not.toHaveBeenCalled()
  })

  it('removes a visible transport error toast when connection is restored', async () => {
    const { socketTransportErrorToastDelayMs, socketTransportErrorToastId, useSocketTransportErrorToast } =
      await loadSocketTransportErrorToast()
    const { hideSocketTransportErrorToast, showSocketTransportErrorToast } = useSocketTransportErrorToast()

    showSocketTransportErrorToast()
    await vi.advanceTimersByTimeAsync(socketTransportErrorToastDelayMs)
    hideSocketTransportErrorToast()

    expect(toastMock.remove).toHaveBeenCalledWith(socketTransportErrorToastId)
  })
})
