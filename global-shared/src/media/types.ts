export type MediaKind = 'image' | 'video' | 'audio' | 'pdf' | 'unknown'

export type MediaBucketName = 'avatar' | 'doc' | 'image' | 'audio' | 'video'
export type MediaId = string | null
export type MediaUpload =
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

export interface MediaValidationOptions {
  supportedKindMediaType: MediaKind
  maxMb: number
}

export interface ImageObject {
  src: string
  name: string
  fileBuffer?: ArrayBuffer
}

export type MediaFileValue = ImageObject
