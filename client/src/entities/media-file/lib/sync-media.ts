import { REQ_STATUS, isNumber } from 'global-shared'

import { isHttpError } from 'src/shared/api'

import { MISSING_MEDIA_RETRY_INTERVAL_MS, UPDATE_MEDIA_INTERVAL_MS } from '../config/constants'

import type { SyncMediaDeps, MediaHeaders, SyncMediaOptions } from './types'

const isRecentlyChecked = (lastChecked: number, interval: number) => Date.now() - lastChecked < interval

export const syncMedia = async (mediaId: string, deps: SyncMediaDeps, options: SyncMediaOptions = {}) => {
  const record = await deps.mediaGet(mediaId)
  const lastChecked = record?.lastChecked
  const shouldRespectCacheInterval = !options.force
  const hasLastChecked = isNumber(lastChecked)
  const isMissingRecentlyChecked =
    shouldRespectCacheInterval &&
    record?.status === 'missing' &&
    isRecentlyChecked(record.lastChecked, MISSING_MEDIA_RETRY_INTERVAL_MS)
  const isReadyRecentlyChecked =
    shouldRespectCacheInterval &&
    record?.status !== 'missing' &&
    hasLastChecked &&
    isRecentlyChecked(lastChecked, UPDATE_MEDIA_INTERVAL_MS)

  if (isMissingRecentlyChecked) {
    return
  }

  if (isReadyRecentlyChecked) {
    return
  }

  const markMissing = async () => {
    await deps.putMedia({
      id: mediaId,
      lastChecked: Date.now(),
      status: 'missing'
    })
  }

  const refreshCheck = async () => {
    let meta: MediaHeaders

    try {
      meta = await deps.loadMediaHeaders(mediaId)
    } catch (error) {
      if (isHttpError(error) && error.status === REQ_STATUS.notFound) {
        await markMissing()

        return
      }

      throw error
    }

    if (meta.etag && record?.etag && meta.etag === record.etag) {
      await deps.updateMedia(mediaId, { lastChecked: Date.now(), status: 'ready' })

      return
    }

    await deps.loadMedia(mediaId)
  }

  if (record) {
    await refreshCheck()

    return
  }

  await deps.loadMedia(mediaId)
}
