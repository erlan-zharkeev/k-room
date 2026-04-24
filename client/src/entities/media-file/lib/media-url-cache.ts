import type { MediaUrlCacheValueType } from './types'

const cache = new Map<string, MediaUrlCacheValueType>()

export const acquireUrl = (key: string, blob: Blob) => {
  const hit = cache.get(key)

  if (hit) {
    hit.refs += 1

    return hit.url
  }

  const url = URL.createObjectURL(blob)

  cache.set(key, { refs: 1, url })

  return url
}

export const releaseUrl = (key: string) => {
  const hit = cache.get(key)

  if (!hit) return

  hit.refs -= 1

  if (hit.refs <= 0) {
    URL.revokeObjectURL(hit.url)
    cache.delete(key)
  }
}
