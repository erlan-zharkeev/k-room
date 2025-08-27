import { IDbMedia } from 'src/shared/config'
import { db, dexieKeyValueStore } from 'src/shared/lib'

export const mediaStore = dexieKeyValueStore<IDbMedia>(db.media, 'media')

export const useMedia = () => {
  const updateMedia = async (filename: string, payload: Partial<IDbMedia>) => {
    await db.media.update(filename, payload)
  }

  const reset = async () => {
    await db.media.clear()
  }

  return {
    media: db.media,
    updateMedia,
    reset
  }
}
