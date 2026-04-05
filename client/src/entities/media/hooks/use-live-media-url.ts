import { useEffect, useState } from 'react'

import { acquireUrl, releaseUrl } from 'src/entities/media'

import { IDbMedia } from 'src/shared/config'
import { db, dexieCollectionStore } from 'src/shared/lib'

const mediaStore = dexieCollectionStore<IDbMedia>(db.media)

export const useLiveMediaUrl = (id: string) => {
  const currentRecord = mediaStore.useById(id)
  const record =
    currentRecord?.blob && currentRecord?.etag
      ? {
          blob: currentRecord.blob,
          etag: currentRecord.etag
        }
      : undefined

  const key = id && record?.etag ? `${id}:${record.etag}` : undefined

  const [url, setUrl] = useState<string | undefined>()

  useEffect(() => {
    if (!key || !record?.blob) {
      setUrl(undefined)
      return
    }
    const url = acquireUrl(key, record.blob)
    setUrl(url)

    return () => {
      releaseUrl(key)
    }
  }, [key, record?.blob])

  return url
}
