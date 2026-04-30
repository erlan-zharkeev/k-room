export { MEDIA_BUCKET_NAMES, MEDIA_VALIDATION_OPTIONS_MAP as VALIDATION_MEDIA_OPTIONS_MAP } from 'global-shared'

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
