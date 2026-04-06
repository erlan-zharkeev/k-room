import { syncMedia, useLoadMedia } from 'src/features/media'

import { useMedia } from 'src/entities/media'

export const useSyncMedia = () => {
  const { get, update: updateMedia } = useMedia()
  const { loadMedia, loadMediaHeaders } = useLoadMedia()

  const sync = (filename: string) => {
    syncMedia(filename, {
      mediaGet: (filename: string) => get(filename),
      updateMedia: (fn: string, patch) => updateMedia(fn, patch),
      loadMedia: (fn: string) => loadMedia(fn),
      loadMediaHeaders: (fn: string) => loadMediaHeaders(fn)
    }).catch(console.error)
  }

  return { sync }
}
