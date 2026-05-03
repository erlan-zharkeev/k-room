import type { IMediaValidationOptions, MediaBucketNameType, MediaKindType, MediaUploadType } from './types'

export const MEDIA_MB_IN_BYTES = 1024 * 1024

export const MEDIA_BUCKET_NAMES = ['avatar', 'doc', 'image', 'audio', 'video'] as const satisfies MediaBucketNameType[]

export const MEDIA_KIND_ACCEPT_MAP = {
  image: 'image/*',
  video: 'video/*',
  audio: 'audio/*',
  pdf: 'application/pdf',
  unknown: ''
} as const satisfies Record<MediaKindType, string>

export const MEDIA_KIND_ALLOWED_UPLOAD_TYPES_MAP = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'svg-xml', 'webp'],
  video: ['mp4', 'webm', 'wideo-ogg'],
  audio: ['mpeg', 'audio-ogg', 'wav'],
  pdf: ['pdf'],
  unknown: []
} as const satisfies Record<MediaKindType, MediaUploadType[]>

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
  'wideo-ogg': 'OGG',
  jpeg: 'JPEG',
  jpg: 'JPG',
  png: 'PNG',
  gif: 'GIF',
  'svg-xml': 'SVG',
  webp: 'WEBP'
} as const satisfies Record<MediaUploadType, string>

export const MEDIA_VALIDATION_OPTIONS_MAP = {
  avatar: {
    maxMb: 10,
    supportedKindMediaType: 'image'
  },
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
} as const satisfies Record<MediaBucketNameType, IMediaValidationOptions>
