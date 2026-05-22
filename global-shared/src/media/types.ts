export type MediaKindType = 'image' | 'video' | 'audio' | 'pdf' | 'unknown'

export type MediaBucketNameType = 'avatar' | 'doc' | 'image' | 'audio' | 'video'
export type MediaUploadType =
  | 'zip'
  | 'rar'
  | '7z'
  | 'pdf'
  | 'msword'
  | 'docx'
  | 'xlsx'
  | 'pptx'
  | 'json'
  | 'xml'
  | 'mpeg'
  | 'audio-ogg'
  | 'wav'
  | 'mp4'
  | 'webm'
  | 'wideo-ogg'
  | 'jpeg'
  | 'jpg'
  | 'png'
  | 'gif'
  | 'svg-xml'
  | 'webp'

export interface MediaValidationOptionsType {
  supportedKindMediaType: MediaKindType
  maxMb: number
}

export interface ImageObjectType {
  src: string
  name: string
  fileBuffer?: ArrayBuffer
}

export type MediaFileValueType = ImageObjectType
