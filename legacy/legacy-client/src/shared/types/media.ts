import { MediaFileValueType, MediaKindType } from 'common'

export const IMAGE_RESOLUTIONS = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  jpg: 'image/jpg'
} as const

export type FileLoaderValueType = MediaFileValueType | MediaFileValueType[] | string | null

export interface IDbMedia {
  id: string
  blob: Blob
  contentType: string
  etag: string
  kind: MediaKindType
  lastModified: string
  lastChecked: number
}
