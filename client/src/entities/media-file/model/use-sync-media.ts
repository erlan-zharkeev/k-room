import { syncMedia } from '../lib/sync-media'

import { useLoadMedia } from './use-load-media'
import { useMedia } from './use-media'

export const useSyncMedia = () => {
  const { get, update } = useMedia()
  const { loadMedia, loadMediaHeaders } = useLoadMedia()

  const sync = (filename: string) => {
    syncMedia(filename, {
      mediaGet: (fileName) => get(fileName),
      updateMedia: (fileName, patch) => update(fileName, patch),
      loadMedia: (fileName) => loadMedia(fileName),
      loadMediaHeaders: (fileName) => loadMediaHeaders(fileName)
    }).catch(console.error)
  }

  return { sync }
}
