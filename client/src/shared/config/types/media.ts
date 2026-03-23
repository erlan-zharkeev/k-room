import { MediaFileValueType, MediaKindType } from 'common-types'

export enum ImageResolutions {
  png = 'image/png',
  jpeg = 'image/jpeg',
  jpg = 'image/jpg'
}

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
