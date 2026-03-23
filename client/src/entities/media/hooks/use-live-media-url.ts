import { useEffect, useState } from 'react'

import { useLiveQuery } from 'dexie-react-hooks'

import { acquireUrl, releaseUrl } from 'src/entities/media'

import { db } from 'src/shared/lib'

export const useLiveMediaUrl = (id: string) => {
  const record = useLiveQuery(async () => {
    const currentRecord = await db.media.get(id)
    if (!currentRecord) return undefined as { blob: Blob; etag: string } | undefined
    return { blob: currentRecord.blob, etag: currentRecord.etag }
  }, [id])

  const key = id && record?.etag ? `${id}:${record.etag}` : undefined

  const [url, setUrl] = useState<string | undefined>()

  useEffect(() => {
    if (!key || !record?.blob) {
      setUrl(undefined)
      return
    }
    const url = acquireUrl(key, record.blob)
    setUrl(url)

    return () => { releaseUrl(key) }
  }, [key, record?.blob])

  return url
}
