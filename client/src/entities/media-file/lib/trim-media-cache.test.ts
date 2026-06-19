import { describe, expect, it, vi } from 'vitest'

import { trimMediaCache } from './trim-media-cache'

describe('trimMediaCache', () => {
  it('trims oldest cached media records until record threshold or byte target is reached', async () => {
    const deleteMediaRecords = vi.fn()
    const loadMediaRecords = vi.fn().mockResolvedValue([
      { id: 'new-small', lastChecked: 30, blob: { size: 1 } },
      { id: 'old-small', lastChecked: 10, blob: { size: 1 } },
      { id: 'old-large', lastChecked: 10, blob: { size: 999 } },
      { id: 'missing-blob', lastChecked: 0, blob: null }
    ])

    await expect(trimMediaCache({ deleteMediaRecords, loadMediaRecords })).resolves.toEqual({ trimmed: true })
    expect(deleteMediaRecords).toHaveBeenCalledWith(['old-large', 'old-small', 'new-small'])
  })
})
