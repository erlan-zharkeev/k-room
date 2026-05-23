import { isHttpError } from 'src/shared/api'

import { enqueueMediaSync } from '../lib/media-sync-queue'
import { syncMedia } from '../lib/sync-media'
import type { SyncMediaOptions } from '../lib/types'

import { useLoadMedia } from './use-load-media.model'
import { useMedia } from './use-media.model'

export const useSyncMedia = () => {
  const { get, put, update } = useMedia()
  const { loadMedia, loadMediaHeaders } = useLoadMedia()

  const syncWithOptions = (filename: string, options: SyncMediaOptions = {}) => {
    const run = async () => {
      try {
        await enqueueMediaSync(filename, () =>
          syncMedia(
            filename,
            {
              mediaGet: (fileName) => get(fileName),
              putMedia: (data) => put(data),
              updateMedia: (fileName, patch) => update(fileName, patch),
              loadMedia: (fileName) => loadMedia(fileName),
              loadMediaHeaders: (fileName) => loadMediaHeaders(fileName)
            },
            options
          )
        )
      } catch (error) {
        if (isHttpError(error)) return

        console.error(error)
      }
    }

    void run()
  }
  const sync = (filename: string) => {
    syncWithOptions(filename)
  }

  return { sync, syncWithOptions }
}
