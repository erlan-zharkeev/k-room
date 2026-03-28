import { ValidateFileMetaOptionsMapType } from 'src/entities/media/config'

import { SharpSettingsKeyType } from 'src/shared/config'

export const ALLOWED_CONTENT_TYPES = ['image/', 'audio/', 'video/', 'application/pdf']

export const MEDIA_BUCKET_NAMES = ['avatar', 'doc', 'image', 'audio', 'video'] as const

export const validationMediaOptionsMap: ValidateFileMetaOptionsMapType = {
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

export const SHARP_PRESETS: Record<
  SharpSettingsKeyType,
  { quality: number; dimensions: { width: number | null; height: number | null } }
> = {
  avatar: {
    dimensions: {
      width: 300,
      height: 300
    },
    quality: 100
  },
  'common-compressed': {
    quality: 60,
    dimensions: {
      width: null,
      height: null
    }
  },
  'common-uncompressed': {
    quality: 100,
    dimensions: {
      width: null,
      height: null
    }
  }
}
