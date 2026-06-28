import { useTimeoutFn } from '@vueuse/core'
import { getCurrentScope, nextTick, onScopeDispose, shallowRef, toValue, watch, type MaybeRefOrGetter } from 'vue'

import { getDexieMediaRecord, getDexieMediaRecords, subscribeDexieLiveQuery } from '../db/db.model'

import { MEDIA_URL_RELEASE_DELAY_MS } from './constants'
import type { MediaUrlCacheKeyParams, MediaUrlCacheValue } from './types'

const cache = new Map<string, MediaUrlCacheValue>()

const buildMediaUrlCacheKey = ({ mediaId, etag, lastChecked, lastModified }: MediaUrlCacheKeyParams) => {
  const version = etag ?? lastModified ?? String(lastChecked)

  return `${mediaId}:${version}`
}

const hasMediaUrlCacheKeyChanges = (currentKeys: string[], nextKeys: string[]) => {
  const hasDifferentLength = currentKeys.length !== nextKeys.length

  if (hasDifferentLength) return true

  return currentKeys.some((key, index) => key !== nextKeys[index])
}

const hasMediaIdChanges = (currentIds: readonly string[], nextIds: readonly string[]) => {
  const hasDifferentLength = currentIds.length !== nextIds.length

  if (hasDifferentLength) return true

  return currentIds.some((id, index) => id !== nextIds[index])
}

const cancelUrlRelease = (hit: MediaUrlCacheValue) => {
  hit.cancelRelease?.()
  hit.cancelRelease = undefined
}

const revokeReleasedUrl = (key: string) => {
  const hit = cache.get(key)

  if (!hit) return
  if (hit.refs > 0) return

  URL.revokeObjectURL(hit.url)
  cache.delete(key)
}

export const acquireUrl = (key: string, blob: Blob) => {
  const hit = cache.get(key)

  if (hit) {
    cancelUrlRelease(hit)
    hit.refs += 1

    return hit.url
  }

  const url = URL.createObjectURL(blob)

  cache.set(key, { refs: 1, url })

  return url
}

export const releaseUrl = (key: string) => {
  const hit = cache.get(key)

  if (!hit) return
  if (hit.refs <= 0) return

  hit.refs -= 1

  if (hit.refs > 0) return

  cancelUrlRelease(hit)

  const { start, stop } = useTimeoutFn(() => revokeReleasedUrl(key), MEDIA_URL_RELEASE_DELAY_MS, {
    immediate: false
  })

  hit.cancelRelease = stop
  start()
}

const releaseUrlAfterRender = (key: string) => {
  void nextTick(() => releaseUrl(key))
}

const releaseUrlsAfterRender = (keys: string[]) => {
  void nextTick(() => {
    keys.forEach(releaseUrl)
  })
}

export const useLiveMediaUrl = (id: MaybeRefOrGetter<string | null | undefined>) => {
  const url = shallowRef<string>()
  let currentKey = ''

  const clearUrl = () => {
    if (!currentKey) {
      url.value = undefined

      return
    }

    const previousKey = currentKey

    currentKey = ''
    url.value = undefined
    releaseUrlAfterRender(previousKey)
  }

  const stop = watch(
    () => toValue(id),
    (mediaId, _previous, onCleanup) => {
      clearUrl()

      if (!mediaId) return

      const unsubscribe = subscribeDexieLiveQuery(() => getDexieMediaRecord(mediaId), {
        next: (record) => {
          if (!record?.blob) {
            clearUrl()

            return
          }

          const { blob, etag, lastChecked, lastModified } = record
          const key = buildMediaUrlCacheKey({ mediaId, etag, lastChecked, lastModified })

          if (currentKey === key) return

          const previousKey = currentKey

          currentKey = key
          url.value = acquireUrl(key, blob)

          if (previousKey) {
            releaseUrlAfterRender(previousKey)
          }
        },
        error: clearUrl
      })

      onCleanup(() => {
        unsubscribe()
        clearUrl()
      })
    },
    { immediate: true }
  )

  if (getCurrentScope()) {
    onScopeDispose(stop)
  }

  return url
}

export const useLiveMediaUrls = (ids: MaybeRefOrGetter<readonly string[]>) => {
  const urls = shallowRef<string[]>([])
  let currentIds: readonly string[] = []
  let currentKeys: string[] = []
  let unsubscribeCurrent: (() => void) | null = null

  const clearUrls = () => {
    if (!currentKeys.length) {
      urls.value = []

      return
    }

    const previousKeys = currentKeys

    currentKeys = []
    urls.value = []
    releaseUrlsAfterRender(previousKeys)
  }

  const stop = watch(
    () => [...toValue(ids)],
    (mediaIds) => {
      if (!hasMediaIdChanges(currentIds, mediaIds)) return

      unsubscribeCurrent?.()
      unsubscribeCurrent = null
      clearUrls()
      currentIds = mediaIds

      if (!mediaIds.length) return

      unsubscribeCurrent = subscribeDexieLiveQuery(() => getDexieMediaRecords(mediaIds), {
        next: (records) => {
          const entries = records.flatMap((record, index) => {
            if (!record?.blob) return []

            const mediaId = mediaIds[index]
            const { blob, etag, lastChecked, lastModified } = record
            const key = buildMediaUrlCacheKey({ mediaId, etag, lastChecked, lastModified })

            return [{ blob, key }]
          })
          const nextKeys = entries.map(({ key }) => key)

          if (!hasMediaUrlCacheKeyChanges(currentKeys, nextKeys)) return

          const previousKeys = currentKeys
          const nextUrls = entries.map(({ blob, key }) => acquireUrl(key, blob))

          currentKeys = nextKeys
          urls.value = nextUrls
          releaseUrlsAfterRender(previousKeys)
        },
        error: clearUrls
      })
    },
    { immediate: true }
  )

  if (getCurrentScope()) {
    onScopeDispose(() => {
      stop()
      unsubscribeCurrent?.()
      clearUrls()
    })
  }

  return urls
}

export const useLiveMediaUrlMap = (ids: MaybeRefOrGetter<readonly string[]>) => {
  const urlMap = shallowRef(new Map<string, string>())
  let currentIds: readonly string[] = []
  let currentKeys: string[] = []
  let unsubscribeCurrent: (() => void) | null = null

  const clearUrls = () => {
    if (!currentKeys.length) {
      urlMap.value = new Map()

      return
    }

    const previousKeys = currentKeys

    currentKeys = []
    urlMap.value = new Map()
    releaseUrlsAfterRender(previousKeys)
  }

  const stop = watch(
    () => [...toValue(ids)],
    (mediaIds) => {
      if (!hasMediaIdChanges(currentIds, mediaIds)) return

      unsubscribeCurrent?.()
      unsubscribeCurrent = null
      clearUrls()
      currentIds = mediaIds

      if (!mediaIds.length) return

      unsubscribeCurrent = subscribeDexieLiveQuery(() => getDexieMediaRecords(mediaIds), {
        next: (records) => {
          const entries = records.flatMap((record, index) => {
            if (!record?.blob) return []

            const mediaId = mediaIds[index]
            const { blob, etag, lastChecked, lastModified } = record
            const key = buildMediaUrlCacheKey({ mediaId, etag, lastChecked, lastModified })

            return [{ blob, key, mediaId }]
          })
          const nextKeys = entries.map(({ key }) => key)

          if (!hasMediaUrlCacheKeyChanges(currentKeys, nextKeys)) return

          const previousKeys = currentKeys
          const nextUrlMap = new Map(entries.map(({ blob, key, mediaId }) => [mediaId, acquireUrl(key, blob)]))

          currentKeys = nextKeys
          urlMap.value = nextUrlMap
          releaseUrlsAfterRender(previousKeys)
        },
        error: clearUrls
      })
    },
    { immediate: true }
  )

  if (getCurrentScope()) {
    onScopeDispose(() => {
      stop()
      unsubscribeCurrent?.()
      clearUrls()
    })
  }

  return urlMap
}
