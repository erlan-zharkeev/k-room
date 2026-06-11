export type MediaKind = 'image' | 'video' | 'audio' | 'pdf' | 'document' | 'archive' | 'unknown'

export type MediaBucketName = 'doc' | 'image' | 'audio' | 'video'
export type MediaId = string | null
export type MediaAudioUploadExtension = 'mp3' | 'ogg' | 'wav'
export type MediaVideoUploadExtension = 'mp4' | 'webm' | 'mov' | 'ogg'
export type MediaDocumentUploadExtension =
  | 'pdf'
  | 'doc'
  | 'docx'
  | 'xls'
  | 'xlsx'
  | 'ppt'
  | 'pptx'
  | 'json'
  | 'xml'
  | 'zip'
  | 'rar'
  | '7z'
export type MediaUpload =
  | 'zip'
  | 'rar'
  | '7z'
  | 'pdf'
  | 'msword'
  | 'docx'
  | 'xls'
  | 'xlsx'
  | 'ppt'
  | 'pptx'
  | 'json'
  | 'xml'
  | 'mpeg'
  | 'audio-ogg'
  | 'wav'
  | 'mp4'
  | 'webm'
  | 'mov'
  | 'video-ogg'
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

export interface MediaObject {
  src: string
  name: string
  fileBuffer?: ArrayBuffer
}

export interface ImageObject extends MediaObject {
  aspectRatio?: number
  contentType?: string
  size?: number
}

export interface DocumentObject extends MediaObject {
  contentType?: string
  size?: number
}

export interface AudioObject extends MediaObject {
  contentType?: string
  size?: number
}

export interface VideoObject extends MediaObject {
  contentType?: string
  size?: number
}

export interface EventMediaFilesDeleted {
  mediaIds: string[]
}
