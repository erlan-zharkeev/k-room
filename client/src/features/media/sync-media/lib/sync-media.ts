import { ISyncMediaDeps } from 'src/features/media'

export const syncMedia = async (filename: string, deps: ISyncMediaDeps) => {
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
