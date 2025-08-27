import { useEffect, useState } from 'react'

import { useMedia } from 'src/entities/media'

import { UPDATE_MEDIA_INTERVAL } from '../../config'
import { useLoadMedia } from '../../load-media'

export const useGetMedia = (id: string, prefix: string) => {
  const { media, updateMedia } = useMedia()
  const { loadMedia, loadMediaHeaders } = useLoadMedia()
  const [src, setSrc] = useState<string>()

  useEffect(() => {
    if (!id) return
    const filename = `${prefix}.${id}`
    let revoke: (() => void) | undefined

    const run = async () => {
      const record = await media.get(filename)
      let url: string

      if (record) {
        url = URL.createObjectURL(record.blob)
        if (Date.now() - record.lastChecked > UPDATE_MEDIA_INTERVAL) {
          const mediaData = await loadMediaHeaders(filename)
          if (mediaData.etag === record.etag) return
          revoke?.()
          url = await loadMedia(filename)
          updateMedia(filename, { lastChecked: Date.now() })
        }
      } else {
        url = await loadMedia(filename)
      }

      setSrc(url)
      revoke = () => URL.revokeObjectURL(url)
    }

    run().catch(console.error)

    return () => {
      revoke?.()
    }
  }, [id])

  return src
}
