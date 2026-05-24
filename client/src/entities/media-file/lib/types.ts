import type { MediaRecord } from 'src/shared/lib'

export type MediaQueueTask = () => Promise<void>
export type MediaHeaders = Partial<Pick<MediaRecord, 'etag'>>
export type MediaSyncTask = () => Promise<void>

export interface MediaQueuedSyncTask {
  run: MediaQueueTask
  resolve: () => void
}

export interface SyncMediaDeps {
  mediaGet: (mediaId: string) => Promise<MediaRecord | undefined>
  putMedia: (data: MediaRecord) => Promise<void>
  updateMedia: (mediaId: string, patch: Partial<MediaRecord>) => Promise<number>
  loadMedia: (mediaId: string) => Promise<void>
  loadMediaHeaders: (mediaId: string) => Promise<MediaHeaders>
}

export interface SyncMediaOptions {
  force?: boolean
}

export interface TrimMediaCacheDeps {
  deleteMediaRecords: (ids: readonly string[]) => Promise<void>
  loadMediaRecords: () => Promise<MediaRecord[]>
}
