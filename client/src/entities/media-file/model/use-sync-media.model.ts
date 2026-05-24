import { isHttpError } from 'src/shared/api'

import { enqueueMediaSync } from '../lib/media-sync-queue'
import { syncMedia } from '../lib/sync-media'
import type { SyncMediaOptions } from '../lib/types'

import { useLoadMedia } from './use-load-media.model'
import { useMedia } from './use-media.model'

export const useSyncMedia = () => {
  const { get, put, update } = useMedia()
  const { loadMedia, loadMediaHeaders } = useLoadMedia()

  const syncWithOptions = (mediaId: string, options: SyncMediaOptions = {}) => {
    const run = async () => {
      try {
        await enqueueMediaSync(mediaId, () =>
          syncMedia(
            mediaId,
            {
              mediaGet: (id) => get(id),
              putMedia: (data) => put(data),
              updateMedia: (id, patch) => update(id, patch),
              loadMedia: (id) => loadMedia(id),
              loadMediaHeaders: (id) => loadMediaHeaders(id)
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
  const sync = (mediaId: string) => {
    syncWithOptions(mediaId)
  }

  return { sync, syncWithOptions }
}
