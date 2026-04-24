import type { IDbMedia } from 'src/shared/config'

export type MediaUrlCacheValueType = {
  refs: number
  url: string
}

export interface ISyncMediaDeps {
  mediaGet: (filename: string) => Promise<IDbMedia | undefined>
  updateMedia: (filename: string, patch: Partial<IDbMedia>) => Promise<number>
  loadMedia: (filename: string) => Promise<void>
  loadMediaHeaders: (filename: string) => Promise<Partial<Pick<IDbMedia, 'etag'>>>
}
