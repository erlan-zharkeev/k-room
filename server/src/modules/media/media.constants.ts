import type { IMediaBucketOptions, MediaBucketNameType } from './media.types'

export const MEDIA_BUCKET_NAMES: MediaBucketNameType[] = ['avatar', 'doc', 'image', 'audio', 'video']

export const VALIDATION_MEDIA_OPTIONS_MAP: Record<MediaBucketNameType, IMediaBucketOptions> = {
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
}

export const SHARP_PRESETS = {
  avatar: {
    dimensions: {
      width: 300,
      height: 300
    },
    quality: 100
  },
  'common-compressed': {
    dimensions: {
      width: null,
      height: null
    },
    quality: 60
  },
  'common-uncompressed': {
    dimensions: {
      width: null,
      height: null
    },
    quality: 100
  }
} as const
