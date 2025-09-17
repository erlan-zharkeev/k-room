import { useEffect, useState } from 'react'

import { useLoadMedia } from 'src/features/media'

import { acquireUrl, releaseUrl } from 'src/entities/media/lib'

// TODO Возможно стоит удалить!!!
export const useGetContactAvatar = (id: string) => {
  const { getMediaStream } = useLoadMedia()
  const [url, setUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    const filename = `avatar.${id}`

    const run = async () => {
      if (!id) { setUrl(undefined); return }
      const blob = await getMediaStream(filename)
      if (!blob || cancelled) { setUrl(undefined); return }
      const url = acquireUrl(filename, blob)
      if (!cancelled) setUrl(url)
    }

    run()
    return () => {
      cancelled = true
      releaseUrl(`avatar.${id}`)
    }
  }, [id])

  return { url }
}
