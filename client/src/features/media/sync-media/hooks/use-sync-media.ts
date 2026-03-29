
import { useMedia } from 'src/entities/media'

import { syncMedia } from '..'
import { useLoadMedia } from '../../load-media'

export const useSyncMedia = () => {
  const { media, update: updateMedia } = useMedia()
  const { loadMedia, loadMediaHeaders } = useLoadMedia()

  const sync = (filename: string) => {
    syncMedia(filename, {
      mediaGet: (filename: string) => media.get(filename),
      updateMedia: (fn: string, patch) => updateMedia(fn, patch),
      loadMedia: (fn: string) => loadMedia(fn),
      loadMediaHeaders: (fn: string) => loadMediaHeaders(fn)
    }).catch(console.error)
  }

  return { sync }
}
