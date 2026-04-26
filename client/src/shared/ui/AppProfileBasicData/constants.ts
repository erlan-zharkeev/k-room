import type { IAppProfileBasicDataProps } from './types'

export const APP_PROFILE_BASIC_DATA_DEFAULT_PROPS = {
  imageAlt: '',
  imageId: '',
  fallbackImageSrc: '/img/Logo.svg'
} satisfies Partial<IAppProfileBasicDataProps>
