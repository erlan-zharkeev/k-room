import { getCurrentScope, onScopeDispose, shallowRef, watch } from 'vue'

import type { IDbMedia } from 'src/shared/lib'
import { db, dexieCollectionStore } from 'src/shared/lib'

import { acquireUrl, releaseUrl } from '../lib/media-url-cache'

const mediaStore = dexieCollectionStore<IDbMedia>(db.media)

export const useLiveMediaUrl = (id: string) => {
  const currentRecord = mediaStore.useById(id)
  const url = shallowRef<string>()

  const stop = watch(
    () => currentRecord.value,
    (record, _previous, onCleanup) => {
      if (!record?.blob || !record.etag) {
        url.value = undefined

        return
      }

      const key = `${id}:${record.etag}`

      url.value = acquireUrl(key, record.blob)
      onCleanup(() => {
        releaseUrl(key)
      })
    },
    { immediate: true }
  )

  if (getCurrentScope()) {
    onScopeDispose(stop)
  }

  return url
}
