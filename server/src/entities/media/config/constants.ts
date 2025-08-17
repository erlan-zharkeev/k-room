import { ValidateFileMetaOptionsMapType } from './types'

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
