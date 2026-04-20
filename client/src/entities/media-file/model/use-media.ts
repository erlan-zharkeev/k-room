import { useLiveMediaUrl } from 'src/entities/media-file'

import { IDbMedia } from 'src/shared/config'
import { db, dexieCollectionStore } from 'src/shared/lib'

const mediaStore = dexieCollectionStore<IDbMedia>(db.media)

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
