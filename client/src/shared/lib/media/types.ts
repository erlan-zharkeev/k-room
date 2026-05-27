export type MediaUrlCacheValue = {
  refs: number
  url: string
}

export type MediaUrlCacheKeyParams = {
  mediaId: string
  etag?: string
  lastModified?: string
  lastChecked: number
}
