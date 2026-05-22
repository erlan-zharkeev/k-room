import type { MediaRecord } from 'src/shared/lib'
import {
  DEXIE_CACHE_TRIMMER_IDS,
  DEXIE_CACHE_TRIMMER_PRIORITIES,
  db,
  dexieCollectionStore,
  registerDexieCacheTrimmer,
  useLiveMediaUrl
} from 'src/shared/lib'

import { trimMediaCache } from '../lib/trim-media-cache'

const mediaStore = dexieCollectionStore<MediaRecord>(db.media)
let isMediaCacheTrimmerInitialized = false

export const initializeMediaCacheTrimmer = () => {
  if (isMediaCacheTrimmerInitialized) return

  registerDexieCacheTrimmer({
    id: DEXIE_CACHE_TRIMMER_IDS.MEDIA,
    priority: DEXIE_CACHE_TRIMMER_PRIORITIES.MEDIA,
    trim: () =>
      trimMediaCache({
        loadMediaRecords: mediaStore.getAll,
        deleteMediaRecords: mediaStore.bulkDelete
      })
  })
  isMediaCacheTrimmerInitialized = true
}

export const useMedia = () => {
  const { get, put, remove, reset, update } = mediaStore
  const media = mediaStore.use()
  const getLiveMediaUrl = (id: string) => useLiveMediaUrl(id)

  return {
    media,
    getLiveMediaUrl,
    get,
    put,
    remove,
    update,
    reset
  }
}
