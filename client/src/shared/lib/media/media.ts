import { liveQuery } from 'dexie'
import { buildAvatarId } from 'global-shared'
import { getCurrentScope, onScopeDispose, shallowRef, toValue, watch, type MaybeRefOrGetter } from 'vue'

import { db } from '../db/db'

import type { MediaUrlCacheValue } from './types'

const cache = new Map<string, MediaUrlCacheValue>()

export const getAvatarId = buildAvatarId

export const acquireUrl = (key: string, blob: Blob) => {
  const hit = cache.get(key)

  if (hit) {
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

  hit.refs -= 1

  if (hit.refs <= 0) {
    URL.revokeObjectURL(hit.url)
    cache.delete(key)
  }
}

export const useLiveMediaUrl = (id: MaybeRefOrGetter<string | null | undefined>) => {
  const url = shallowRef<string>()
  let currentKey = ''

  const clearUrl = () => {
    if (!currentKey) {
      url.value = undefined

      return
    }

    releaseUrl(currentKey)
    currentKey = ''
    url.value = undefined
  }

  const stop = watch(
    () => toValue(id),
    (mediaId, _previous, onCleanup) => {
      clearUrl()

      if (!mediaId) return

      const subscription = liveQuery(() => db.media.get(mediaId)).subscribe({
        next: (record) => {
          if (!record?.blob) {
            clearUrl()

            return
          }

          const version = record.etag ?? record.lastModified ?? String(record.lastChecked)
          const key = `${mediaId}:${version}`

          if (currentKey === key) return

          clearUrl()
          currentKey = key
          url.value = acquireUrl(key, record.blob)
        },
        error: clearUrl
      })

      onCleanup(() => {
        subscription.unsubscribe()
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
