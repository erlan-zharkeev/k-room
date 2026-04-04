import { useLiveMediaUrl } from 'src/entities/media'

import { IDbMedia } from 'src/shared/config'
import { db, dexieCollectionStore } from 'src/shared/lib'

const mediaStore = dexieCollectionStore<IDbMedia>(db.media)

export const useMedia = () => {
  const getLiveMedia = (id: string) => useLiveMediaUrl(id)

  return {
    getLiveMedia,
    get: (id: string) => mediaStore.get(id),
    put: (payload: IDbMedia) => mediaStore.put(payload),
    delete: (id: string) => mediaStore.delete(id),
    update: (id: string, payload: Partial<IDbMedia>) => mediaStore.update(id, payload),
    reset: () => mediaStore.reset()
  }
}
