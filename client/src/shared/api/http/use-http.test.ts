import { MEDIA_ENDPOINTS } from 'global-shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const httpClientMock = vi.hoisted(() => ({
  request: vi.fn()
}))

const toastMock = vi.hoisted(() => ({
  add: vi.fn()
}))

const interceptErrorMock = vi.hoisted(() => vi.fn())

const transportMetaMock = vi.hoisted(() => ({
  handleHttpTransportMeta: vi.fn()
}))

vi.mock('src/shared/lib', () => ({
  TOAST_I18N: {
    success: 'success',
    warn: 'warn'
  },
  getClientPlatform: () => 'browser',
  useAppToast: () => toastMock,
  useI18n: () => ({
    t: (key: string) => key
  })
}))

vi.mock('./auth-refresh', () => ({
  refreshAuthTokens: vi.fn(),
  shouldSkipAuthRefresh: vi.fn(() => false)
}))

vi.mock('./http-client', () => ({
  httpClient: httpClientMock
}))

vi.mock('./use-http-interceptor', () => ({
  useHttpInterceptor: () => ({
    interceptError: interceptErrorMock
  })
}))

vi.mock('../transport-meta', () => transportMetaMock)

const { useHttp } = await import('./use-http')

describe('useHttp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('__CLIENT_ENV_DATA__', { apiBaseUrl: '' })
    interceptErrorMock.mockImplementation(async (error) => error)
  })

  it('does not treat json blob media responses as backend messages', async () => {
    const response = {
      status: 200,
      headers: {
        'content-type': 'application/json'
      },
      data: new Blob(['{"hello":"world"}'], {
        type: 'application/json'
      })
    }
    const { doHttpRequest } = useHttp()

    httpClientMock.request.mockResolvedValue(response)

    await expect(
      doHttpRequest<never, 'blob'>('get', MEDIA_ENDPOINTS.getMediaFile, undefined, { responseType: 'blob' })
    ).resolves.toBe(response)

    expect(toastMock.add).not.toHaveBeenCalled()
    expect(interceptErrorMock).not.toHaveBeenCalled()
  })

  it('shows success messages from backend responses', async () => {
    const response = {
      status: 200,
      headers: {
        'content-type': 'application/json'
      },
      data: {
        payload: null,
        message: {
          text: 'Saved',
          silent: false
        }
      }
    }
    const { doHttpRequest } = useHttp()

    httpClientMock.request.mockResolvedValue(response)

    await expect(doHttpRequest('post', MEDIA_ENDPOINTS.getMediaFile)).resolves.toBe(response)

    expect(transportMetaMock.handleHttpTransportMeta).toHaveBeenCalledWith(response)
    expect(toastMock.add).toHaveBeenCalledWith({
      type: 'success',
      title: 'success',
      content: 'Saved'
    })
  })

  it('lets the browser set multipart form data headers', async () => {
    const response = {
      status: 200,
      headers: {
        'content-type': 'application/json'
      },
      data: {
        payload: null,
        message: {
          text: '',
          silent: true
        }
      }
    }
    const formData = new FormData()
    const { doHttpRequest } = useHttp()

    formData.append('file', new Blob(['avatar']), 'avatar.png')
    httpClientMock.request.mockResolvedValue(response)

    await expect(doHttpRequest('patch', MEDIA_ENDPOINTS.getMediaFile, formData)).resolves.toBe(response)

    expect(httpClientMock.request).toHaveBeenCalledWith(
      expect.objectContaining({
        data: formData,
        headers: {}
      })
    )
  })
})
