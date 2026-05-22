import type { MediaRecord } from 'src/shared/lib'

export type MediaQueueTask = () => Promise<void>
export type MediaHeaders = Partial<Pick<MediaRecord, 'etag'>>
export type MediaSyncTask = () => Promise<void>

export interface SyncMediaDeps {
  mediaGet: (filename: string) => Promise<MediaRecord | undefined>
  putMedia: (data: MediaRecord) => Promise<void>
  updateMedia: (filename: string, patch: Partial<MediaRecord>) => Promise<number>
  loadMedia: (filename: string) => Promise<void>
  loadMediaHeaders: (filename: string) => Promise<MediaHeaders>
}
