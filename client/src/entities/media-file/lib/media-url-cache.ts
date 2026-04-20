const cache = new Map<string, { url: string; refs: number }>()

export const acquireUrl = (key: string, blob: Blob) => {
  const hit = cache.get(key)
  if (hit) {
    hit.refs += 1
    return hit.url
  }
  const url = URL.createObjectURL(blob)
  cache.set(key, { url, refs: 1 })
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
