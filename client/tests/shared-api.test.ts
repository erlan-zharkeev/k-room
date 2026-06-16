import { MEDIA_KIND_HEADER_NAME } from 'global-shared'
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

const indexedApiMock = vi.hoisted(() => ({
  getHeaderValue: vi.fn((value: unknown) => {
    if (Array.isArray(value)) return value.join(', ')

    return typeof value === 'string' ? value : ''
  })
}))

vi.mock('../src/shared/api/socket/socket', () => ({
  socket: socketMock
}))
vi.mock('../src/shared/api/socket/use-socket-availability', () => ({
  useSocketAvailability: () => socketAvailabilityMock
}))
vi.mock('../src/shared/api/socket/use-socket-transport-error-toast', () => ({
  useSocketTransportErrorToast: () => socketToastMock
}))
vi.mock('src/shared/api', () => indexedApiMock)

const httpErrorModule = await import('../src/shared/api/http/create-http-error')
const headerModule = await import('../src/shared/api/http/get-header-value')
const backendResponseModule = await import('../src/shared/api/http/is-backend-response')
const extractErrorModule = await import('../src/shared/api/http/extract-error-payload')
const socketActionModule = await import('../src/shared/api/socket/use-socket-action')
const mediaHeadersModule = await import('../src/entities/media-file/lib/transform-headers-to-media-data')
const roomPayloadModule = await import('../src/pages/app/lib/filter-room-payload-messages')
const { createHttpError, getHandledErrorMessage, isHandledError, isHttpError } = httpErrorModule
const { getHeaderValue } = headerModule
const { isBackendResponse } = backendResponseModule
const { extractErrorPayload } = extractErrorModule
const { useSocketAction } = socketActionModule
const { transformHeadersToMediaData } = mediaHeadersModule
const { filterRoomPayloadMessages } = roomPayloadModule

describe('shared API helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    socketAvailabilityMock.isSocketOnlineActionAvailable.value = true
    socketMock.timeout.mockReturnValue(socketMock)
  })

  it('builds handled http errors and messages', () => {
    const error = createHttpError({
      message: 'Request failed',
      status: 400,
      silent: true,
      payload: null
    })

    expect(isHttpError(error)).toBe(true)
    expect(isHandledError(error)).toBe(true)
    expect(getHandledErrorMessage(error)).toBe('Request failed')
    expect(getHandledErrorMessage({})).toBe('Unknown error')
  })

  it('normalizes header values and detects backend response payloads', () => {
    expect(getHeaderValue(['a', 'b'])).toBe('a, b')
    expect(getHeaderValue('single')).toBe('single')
    expect(getHeaderValue(123)).toBe('')
    expect(isBackendResponse({ message: { text: 'Failed', silent: false }, payload: null })).toBe(true)
    expect(isBackendResponse({ message: { text: 'Failed', silent: 'false' } })).toBe(false)
  })

  it('extracts backend error payload from json blob responses', async () => {
    const payload = {
      message: {
        text: 'Failed',
        silent: false
      },
      payload: {
        code: 'bad'
      }
    }
    const error = {
      response: {
        data: new Blob([JSON.stringify(payload)], {
          type: 'application/json'
        })
      }
    }

    await expect(extractErrorPayload(error as never)).resolves.toEqual(payload)
  })

  it('transforms media response headers to cache metadata', () => {
    vi.useFakeTimers()
    vi.setSystemTime(1_234)

    const result = transformHeadersToMediaData({
      headers: {
        etag: ['etag-1', 'etag-2'],
        'content-type': 'image/png',
        'last-modified': 'Mon, 01 Jan 2024 00:00:00 GMT',
        [MEDIA_KIND_HEADER_NAME]: 'image'
      }
    } as never)

    expect(result).toEqual({
      etag: 'etag-1, etag-2',
      contentType: 'image/png',
      lastModified: 'Mon, 01 Jan 2024 00:00:00 GMT',
      lastChecked: 1_234,
      kind: 'image',
      status: 'ready'
    })
    vi.useRealTimers()
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

  it('filters preview-only fields from room payloads before cache sync', () => {
    expect(
      filterRoomPayloadMessages({
        id: 'room-1',
        users: ['user-1'],
        messages: ['message-1'],
        pinnedMessage: { id: 'message-1' },
        previewMessage: { id: 'message-1' }
      } as never)
    ).toEqual({
      id: 'room-1',
      users: ['user-1'],
      messages: ['message-1']
    })
  })
})
