import { useLiveMediaUrl } from 'src/entities/media-file/model/use-live-media-url'

import { DbMedia } from 'src/shared/config'
import { db, dexieCollectionStore } from 'src/shared/lib'

const mediaStore = dexieCollectionStore<DbMedia>(db.media)

export const useMedia = () => {
  const { get, put, remove, update, reset } = mediaStore
  const getLiveMediaUrl = (id: string) => useLiveMediaUrl(id)

  return {
    getLiveMediaUrl,
    get,
    put,
    remove,
    update,
    reset
  }
}
