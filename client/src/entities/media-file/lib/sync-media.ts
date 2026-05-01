import { REQ_STATUS } from 'global-shared'

import { isApiError } from 'src/shared/api'

import { MISSING_MEDIA_RETRY_INTERVAL_MS, UPDATE_MEDIA_INTERVAL_MS } from '../config/constants'

import type { ISyncMediaDeps, MediaHeadersType } from './types'

const isRecentlyChecked = (lastChecked: number, interval: number) => Date.now() - lastChecked < interval

export const syncMedia = async (filename: string, deps: ISyncMediaDeps) => {
  const record = await deps.mediaGet(filename)

  if (record?.status === 'missing' && isRecentlyChecked(record.lastChecked, MISSING_MEDIA_RETRY_INTERVAL_MS)) {
    return
  }

  if (
    record?.status !== 'missing' &&
    record?.lastChecked &&
    isRecentlyChecked(record.lastChecked, UPDATE_MEDIA_INTERVAL_MS)
  ) {
    return
  }

  const markMissing = async () => {
    await deps.putMedia({
      id: filename,
      lastChecked: Date.now(),
      status: 'missing'
    })
  }

  const refreshCheck = async () => {
    let meta: MediaHeadersType

    try {
      meta = await deps.loadMediaHeaders(filename)
    } catch (error) {
      if (isApiError(error) && error.status === REQ_STATUS.notFound) {
        await markMissing()

        return
      }

      throw error
    }

    if (meta.etag && record?.etag && meta.etag === record.etag) {
      await deps.updateMedia(filename, { lastChecked: Date.now(), status: 'ready' })

      return
    }

    await deps.loadMedia(filename)
    await deps.updateMedia(filename, { lastChecked: Date.now() })
  }

  if (record) {
    await refreshCheck()

    return
  }

  await deps.loadMedia(filename)
  await deps.updateMedia(filename, { lastChecked: Date.now() })
}
