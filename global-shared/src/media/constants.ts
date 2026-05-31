import type {
  MediaAudioUploadExtension,
  MediaDocumentUploadExtension,
  MediaValidationOptions,
  MediaBucketName,
  MediaKind,
  MediaUpload,
  MediaVideoUploadExtension
} from './types'

export const MEDIA_BUCKET_NAMES = ['doc', 'image', 'audio', 'video'] as const satisfies MediaBucketName[]

export const MEDIA_AVATAR_VALIDATION_OPTIONS = {
  maxMb: 10,
  supportedKindMediaType: 'image'
} as const satisfies MediaValidationOptions

export const MEDIA_KIND_ACCEPT_MAP = {
  image: 'image/*',
  video: 'video/*',
  audio: 'audio/*',
  pdf: 'application/pdf',
  archive: 'application/*',
  unknown: ''
} as const satisfies Record<MediaKind, string>

export const MEDIA_KIND_ALLOWED_UPLOAD_TYPES_MAP = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'svg-xml', 'webp'],
  video: ['mp4', 'webm', 'mov', 'video-ogg'],
  audio: ['mpeg', 'audio-ogg', 'wav'],
  pdf: ['pdf'],
  archive: ['zip', 'rar', '7z'],
  unknown: []
} as const satisfies Record<MediaKind, MediaUpload[]>

export const MEDIA_AUDIO_UPLOAD_EXTENSIONS = [
  'mp3',
  'ogg',
  'wav'
] as const satisfies readonly MediaAudioUploadExtension[]
export const MEDIA_VIDEO_UPLOAD_EXTENSIONS = [
  'mp4',
  'webm',
  'mov',
  'ogg'
] as const satisfies readonly MediaVideoUploadExtension[]
export const MEDIA_DOCUMENT_UPLOAD_EXTENSIONS = [
  'pdf',
  'zip',
  'rar',
  '7z'
] as const satisfies readonly MediaDocumentUploadExtension[]

export const MEDIA_BUCKET_SUPPORTED_KIND_MAP = {
  doc: ['pdf', 'archive'],
  image: ['image'],
  audio: ['audio'],
  video: ['video']
} as const satisfies Record<MediaBucketName, MediaKind[]>

export const MEDIA_UPLOAD_TYPE_LABEL_MAP = {
  zip: 'ZIP',
  rar: 'RAR',
  '7z': '7Z',
  pdf: 'PDF',
  msword: 'DOC',
  docx: 'DOCX',
  xlsx: 'XLSX',
  pptx: 'PPTX',
  json: 'JSON',
  xml: 'XML',
  mpeg: 'MPEG',
  'audio-ogg': 'OGG',
  wav: 'WAV',
  mp4: 'MP4',
  webm: 'WEBM',
  mov: 'MOV',
  'video-ogg': 'OGG',
  jpeg: 'JPEG',
  jpg: 'JPG',
  png: 'PNG',
  gif: 'GIF',
  'svg-xml': 'SVG',
  webp: 'WEBP'
} as const satisfies Record<MediaUpload, string>

export const MEDIA_VALIDATION_OPTIONS_MAP = {
  doc: {
    maxMb: 10,
    supportedKindMediaType: 'pdf'
  },
  image: {
    maxMb: 10,
    supportedKindMediaType: 'image'
  },
  audio: {
    maxMb: 20,
    supportedKindMediaType: 'audio'
  },
  video: {
    maxMb: 50,
    supportedKindMediaType: 'video'
  }
} as const satisfies Record<MediaBucketName, MediaValidationOptions>
