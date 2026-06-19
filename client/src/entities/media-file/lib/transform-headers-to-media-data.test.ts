import { MEDIA_KIND_HEADER_NAME } from 'global-shared'
import { describe, expect, it, vi } from 'vitest'

const sharedApiMock = vi.hoisted(() => ({
  getHeaderValue: vi.fn((value: unknown) => {
    if (Array.isArray(value)) return value.join(', ')

    return typeof value === 'string' ? value : ''
  })
}))

vi.mock('src/shared/api', () => sharedApiMock)

const { transformHeadersToMediaData } = await import('./transform-headers-to-media-data')

describe('transformHeadersToMediaData', () => {
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
})
