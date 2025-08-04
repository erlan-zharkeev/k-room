import { MediaFileValueType, MediaType } from 'common-types'

export enum ImageResolutions {
  png = 'image/png',
  jpeg = 'image/jpeg',
  jpg = 'image/jpg'
}

export type FileLoaderValueType = MediaFileValueType | MediaFileValueType[]

export interface DbMediaType {
  id: string
  url: string
  type: MediaType
  createdAt: number
  blobUrl?: string
}
