import type { MediaRecordType } from 'src/shared/lib'
import { db, dexieCollectionStore, useLiveMediaUrl } from 'src/shared/lib'

const mediaStore = dexieCollectionStore<MediaRecordType>(db.media)

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
