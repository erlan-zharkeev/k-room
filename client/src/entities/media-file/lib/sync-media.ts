import type { ISyncMediaDeps } from './types'

export const syncMedia = async (filename: string, deps: ISyncMediaDeps) => {
  const record = await deps.mediaGet(filename)

  const refreshCheck = async () => {
    const meta = await deps.loadMediaHeaders(filename)

    if (meta.etag && record?.etag && meta.etag === record.etag) {
      await deps.updateMedia(filename, { lastChecked: Date.now() })

      return
    }

    await deps.loadMedia(filename)
    await deps.updateMedia(filename, { lastChecked: Date.now() })
  }

  if (record) {
    await refreshCheck()

    return
  }

  await deps.loadMedia(filename)
  await deps.updateMedia(filename, { lastChecked: Date.now() })
}
