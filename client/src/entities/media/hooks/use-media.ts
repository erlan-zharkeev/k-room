
import { useLiveMediaUrl } from 'src/entities/media'

import { IDbMedia } from 'src/shared/config'
import { db } from 'src/shared/lib'

export const useMedia = () => {
  const getLiveMedia = (id: string) => useLiveMediaUrl(id)

  const update = (filename: string, payload: Partial<IDbMedia>) => db.media.update(filename, payload)

  const reset = () => db.media.clear()

  return {
    media: db.media,
    getLiveMedia,
    update,
    reset
  }
}
