import { isApiError } from 'src/shared/api'

import { enqueueMediaSync } from '../lib/media-sync-queue'
import { syncMedia } from '../lib/sync-media'

import { useLoadMedia } from './use-load-media'
import { useMedia } from './use-media'

export const useSyncMedia = () => {
  const { get, put, update } = useMedia()
  const { loadMedia, loadMediaHeaders } = useLoadMedia()

  const sync = (filename: string) => {
    const run = async () => {
      try {
        await enqueueMediaSync(filename, () =>
          syncMedia(filename, {
            mediaGet: (fileName) => get(fileName),
            putMedia: (data) => put(data),
            updateMedia: (fileName, patch) => update(fileName, patch),
            loadMedia: (fileName) => loadMedia(fileName),
            loadMediaHeaders: (fileName) => loadMediaHeaders(fileName)
          })
        )
      } catch (error) {
        if (isApiError(error)) return

        console.error(error)
      }
    }

    void run()
  }

  return { sync }
}
