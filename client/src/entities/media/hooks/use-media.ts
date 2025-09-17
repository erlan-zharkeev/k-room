import { IDbMedia } from 'src/shared/config'
import { db } from 'src/shared/lib'

import { useLiveMediaUrl } from './use-live-media-url'

export const useMedia = () => {
  return {
    media: db.media,
    getLiveMedia: (id: string) => useLiveMediaUrl(id),
    update: (filename: string, payload: Partial<IDbMedia>) => db.media.update(filename, payload),
    reset: () => db.media.clear()
  }
}
