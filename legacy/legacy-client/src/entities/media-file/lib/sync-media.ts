import { DbMedia } from 'src/shared/config'

export interface SyncMediaDeps {
  mediaGet: (filename: string) => Promise<DbMedia | undefined>
  updateMedia: (filename: string, patch: Partial<DbMedia>) => Promise<number>
  loadMedia: (filename: string) => Promise<void>
  loadMediaHeaders: (filename: string) => Promise<{ etag?: string }>
}

export const syncMedia = async (filename: string, deps: SyncMediaDeps) => {
  const record = await deps.mediaGet(filename)

  const refreshCheck = async () => {
    const meta = await deps.loadMediaHeaders(filename)
    if (meta.etag && record?.etag && meta.etag === record.etag) {
      await deps.updateMedia(filename, { lastChecked: Date.now() })
    } else {
      await deps.loadMedia(filename)
      await deps.updateMedia(filename, { lastChecked: Date.now() })
    }
  }

  if (record) {
    await refreshCheck()
  } else {
    await deps.loadMedia(filename)
    await deps.updateMedia(filename, { lastChecked: Date.now() })
  }
}
