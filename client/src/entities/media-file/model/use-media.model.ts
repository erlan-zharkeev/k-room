import type { MediaRecord } from 'src/shared/lib'
import { db, dexieCollectionStore, useLiveMediaUrl } from 'src/shared/lib'

export const mediaStore = dexieCollectionStore<MediaRecord>(db.media)

export const useMedia = () => {
  const { bulkDelete, get, put, remove, reset, update } = mediaStore
  const getLiveMediaUrl = (id: string) => useLiveMediaUrl(id)

  return {
    getLiveMediaUrl,
    bulkDelete,
    get,
    put,
    remove,
    update,
    reset
  }
}
