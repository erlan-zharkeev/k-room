import type { MediaRecordType } from 'src/shared/lib'

export type MediaQueueTaskType = () => Promise<void>
export type MediaHeadersType = Partial<Pick<MediaRecordType, 'etag'>>
export type MediaSyncTaskType = () => Promise<void>

export interface ISyncMediaDeps {
  mediaGet: (filename: string) => Promise<MediaRecordType | undefined>
  putMedia: (data: MediaRecordType) => Promise<void>
  updateMedia: (filename: string, patch: Partial<MediaRecordType>) => Promise<number>
  loadMedia: (filename: string) => Promise<void>
  loadMediaHeaders: (filename: string) => Promise<MediaHeadersType>
}
