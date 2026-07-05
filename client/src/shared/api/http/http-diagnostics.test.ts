import { beforeEach, describe, expect, it, vi } from 'vitest'

interface SentryScopeMock {
  setContext: ReturnType<typeof vi.fn>
  setFingerprint: ReturnType<typeof vi.fn>
  setLevel: ReturnType<typeof vi.fn>
  setTag: ReturnType<typeof vi.fn>
}

const sentryMock = vi.hoisted(() => {
  const scope = {
    setContext: vi.fn(),
    setFingerprint: vi.fn(),
    setLevel: vi.fn(),
    setTag: vi.fn()
  }

  return {
    scope,
    captureClientSentryMessage: vi.fn(),
    withClientSentryScope: vi.fn((callback: (scope: SentryScopeMock) => void) => {
      callback(scope)
    })
  }
})

vi.mock('src/shared/lib', () => sentryMock)

const { captureFailedToPerformOperationHttpError } = await import('./http-diagnostics')

const fallbackMessage = 'Failed to perform operation. Please try again later.'

describe('http-diagnostics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('__CLIENT_ENV_DATA__', {
      apiBaseUrl: 'https://api.k-room.space',
      appVersion: '0.1.35'
    })
    vi.stubGlobal('window', {
      location: {
        origin: 'https://k-room.space',
        protocol: 'https:'
      }
    })
    vi.stubGlobal('navigator', {
      onLine: true,
      platform: 'MacIntel',
      userAgent: 'Safari'
    })
  })

  it('captures HTTP errors when the UI falls back to the shared operation failure message', () => {
    const error = new Error('Request failed with status code 413')

    captureFailedToPerformOperationHttpError(error, {
      displayedMessage: fallbackMessage,
      fallbackMessage,
      status: 413
    })

    expect(sentryMock.captureClientSentryMessage).toHaveBeenCalledWith('HTTP failed to perform operation')
    expect(sentryMock.scope.setContext).toHaveBeenCalledWith(
      'client.http.failedOperation',
      expect.objectContaining({
        displayedMessage: fallbackMessage,
        errorMessage: 'Request failed with status code 413',
        responseStatus: 413
      })
    )
  })

  it('does not capture ignored transport errors even when the UI falls back to the shared message', () => {
    captureFailedToPerformOperationHttpError(new Error('Network Error'), {
      displayedMessage: fallbackMessage,
      fallbackMessage
    })

    expect(sentryMock.captureClientSentryMessage).not.toHaveBeenCalled()
  })

  it('does not capture backend-readable errors that do not use the shared fallback', () => {
    captureFailedToPerformOperationHttpError(new Error('Request failed with status code 500'), {
      displayedMessage: 'Server error',
      fallbackMessage,
      status: 500
    })

    expect(sentryMock.captureClientSentryMessage).not.toHaveBeenCalled()
  })
})
