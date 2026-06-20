import { afterEach, describe, expect, it, vi } from 'vitest'

import { isDownloadFileAvailable } from './is-download-file-available'

const createFetchResponse = (ok: boolean, contentType: string | null) => ({
  ok,
  headers: {
    get: vi.fn(() => contentType)
  }
})

describe('isDownloadFileAvailable', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('accepts an available non-html file response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(createFetchResponse(true, 'application/octet-stream'))

    vi.stubGlobal('fetch', fetchMock)

    await expect(isDownloadFileAvailable('/downloads/K-Room-Setup.exe')).resolves.toBe(true)
    expect(fetchMock).toHaveBeenCalledWith('/downloads/K-Room-Setup.exe', {
      method: 'HEAD',
      cache: 'no-store'
    })
  })

  it('rejects html fallback responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createFetchResponse(true, 'text/html; charset=utf-8')))

    await expect(isDownloadFileAvailable('/downloads/K-Room-Setup.exe')).resolves.toBe(false)
  })

  it('rejects failed file responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createFetchResponse(false, 'application/octet-stream')))

    await expect(isDownloadFileAvailable('/downloads/K-Room-Setup.exe')).resolves.toBe(false)
  })
})
