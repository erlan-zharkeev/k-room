import type { IDbMedia } from 'src/shared/config'
import { db, dexieCollectionStore } from 'src/shared/lib'

import { useLiveMediaUrl } from './use-live-media-url'

const mediaStore = dexieCollectionStore<IDbMedia>(db.media)

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
