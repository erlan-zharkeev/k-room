import type { IMediaValidationOptions, MediaBucketNameType, MediaKindType } from './types'

export const MEDIA_MB_IN_BYTES = 1024 * 1024

export const MEDIA_BUCKET_NAMES = ['avatar', 'doc', 'image', 'audio', 'video'] as const satisfies MediaBucketNameType[]

export const MEDIA_KIND_ACCEPT_MAP = {
  image: 'image/*',
  video: 'video/*',
  audio: 'audio/*',
  pdf: 'application/pdf',
  unknown: ''
} as const satisfies Record<MediaKindType, string>

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
