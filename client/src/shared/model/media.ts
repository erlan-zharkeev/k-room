import type { MediaFileValueType, MediaKindType } from 'global-shared'

export const IMAGE_RESOLUTIONS = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  jpg: 'image/jpg'
} as const

export type FileLoaderValueType = MediaFileValueType | MediaFileValueType[] | string | null
export type DbMediaStatusType = 'missing' | 'ready'

export interface IDbMedia {
  id: string
  blob?: Blob
  contentType?: string
  etag?: string
  kind?: MediaKindType
  lastModified?: string
  lastChecked: number
  status?: DbMediaStatusType
}
