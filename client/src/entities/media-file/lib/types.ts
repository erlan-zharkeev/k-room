import type { IDbMedia } from 'src/shared/lib'

export type MediaQueueTaskType = () => Promise<void>
export type MediaHeadersType = Partial<Pick<IDbMedia, 'etag'>>
export type MediaSyncTaskType = () => Promise<void>

export interface ISyncMediaDeps {
  mediaGet: (filename: string) => Promise<IDbMedia | undefined>
  putMedia: (data: IDbMedia) => Promise<void>
  updateMedia: (filename: string, patch: Partial<IDbMedia>) => Promise<number>
  loadMedia: (filename: string) => Promise<void>
  loadMediaHeaders: (filename: string) => Promise<MediaHeadersType>
}
