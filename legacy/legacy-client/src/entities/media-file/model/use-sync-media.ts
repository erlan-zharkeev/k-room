import { syncMedia } from 'src/entities/media-file/lib/sync-media'

import { useMedia } from './use-media'
import { useLoadMedia } from './use-load-media'

export const useSyncMedia = () => {
  const { get, update: updateMedia } = useMedia()
  const { loadMedia, loadMediaHeaders } = useLoadMedia()

  const sync = (filename: string) => {
    syncMedia(filename, {
      mediaGet: (fileName: string) => get(fileName),
      updateMedia: (fileName: string, patch) => updateMedia(fileName, patch),
      loadMedia: (fileName: string) => loadMedia(fileName),
      loadMediaHeaders: (fileName: string) => loadMediaHeaders(fileName)
    }).catch(console.error)
  }

  return { sync }
}
