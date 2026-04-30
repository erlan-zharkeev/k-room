export type MediaKindType = 'image' | 'video' | 'audio' | 'pdf' | 'unknown'

export type MediaBucketNameType = 'avatar' | 'doc' | 'image' | 'audio' | 'video'

export interface IMediaValidationOptions {
  supportedKindMediaType: MediaKindType
  maxMb: number
}

export interface IImageObject {
  src: string
  name: string
  fileBuffer?: ArrayBuffer
}

export type MediaFileValueType = IImageObject
