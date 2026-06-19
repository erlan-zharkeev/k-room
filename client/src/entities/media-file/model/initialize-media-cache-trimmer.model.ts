import { DEXIE_CACHE_TRIMMER_PRIORITIES, registerDexieCacheTrimmer } from 'src/shared/lib'

import { trimMediaCache } from '../lib/trim-media-cache'

import { mediaStore } from './use-media.model'

let isMediaCacheTrimmerInitialized = false

export const initializeMediaCacheTrimmer = () => {
  if (isMediaCacheTrimmerInitialized) return

  registerDexieCacheTrimmer({
    id: 'media',
    priority: DEXIE_CACHE_TRIMMER_PRIORITIES.media,
    trim: () =>
      trimMediaCache({
        loadMediaRecords: mediaStore.getAll,
        deleteMediaRecords: mediaStore.bulkDelete
      })
  })
  isMediaCacheTrimmerInitialized = true
}
