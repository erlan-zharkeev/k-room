export type MediaUrlCacheValue = {
  cancelRelease?: () => void
  refs: number
  url: string
}

export type MediaUrlCacheKeyParams = {
  mediaId: string
  etag?: string
  lastModified?: string
  lastChecked: number
}
