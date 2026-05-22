import { MediaFileValue, MediaKind } from 'common'

export const IMAGE_RESOLUTIONS = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  jpg: 'image/jpg'
} as const

export type FileLoaderValue = MediaFileValue | MediaFileValue[] | string | null

export interface DbMedia {
  id: string
  blob: Blob
  contentType: string
  etag: string
  kind: MediaKind
  lastModified: string
  lastChecked: number
}
