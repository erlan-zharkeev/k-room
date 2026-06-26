import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const toastMock = vi.hoisted(() => ({
  add: vi.fn(),
  remove: vi.fn()
}))

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

    vi.advanceTimersByTime(socketTransportErrorToastDelayMs - 1)

    expect(toastMock.add).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)

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
    vi.advanceTimersByTime(socketTransportErrorToastDelayMs)

    expect(toastMock.add).not.toHaveBeenCalled()
    expect(toastMock.remove).not.toHaveBeenCalled()
  })

  it('removes a visible transport error toast when connection is restored', async () => {
    const { socketTransportErrorToastDelayMs, socketTransportErrorToastId, useSocketTransportErrorToast } =
      await loadSocketTransportErrorToast()
    const { hideSocketTransportErrorToast, showSocketTransportErrorToast } = useSocketTransportErrorToast()

    showSocketTransportErrorToast()
    vi.advanceTimersByTime(socketTransportErrorToastDelayMs)
    hideSocketTransportErrorToast()

    expect(toastMock.remove).toHaveBeenCalledWith(socketTransportErrorToastId)
  })
})
