import { IDbMedia } from 'src/shared/config'

export interface SyncMediaDeps {
  mediaGet: (filename: string) => Promise<IDbMedia | undefined>
  updateMedia: (filename: string, patch: Partial<IDbMedia>) => Promise<number>
  loadMedia: (filename: string) => Promise<void>
  loadMediaHeaders: (filename: string) => Promise<{ etag?: string }>
}
