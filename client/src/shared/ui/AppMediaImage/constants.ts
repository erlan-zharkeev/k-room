import type { AppMediaImageProps } from './types'

export const APP_MEDIA_IMAGE_DEFAULT_PROPS = {
  alt: '',
  height: 'auto',
  mediaId: '',
  src: '',
  width: '100%'
} satisfies Partial<AppMediaImageProps>
