import type { IAppProfileBasicDataProps } from './types'

export const APP_PROFILE_BASIC_DATA_DEFAULT_PROPS = {
  avatarShape: 'square',
  imageAlt: '',
  imageId: '',
  imageSrc: '',
  name: '',
  selectable: true
} satisfies Partial<IAppProfileBasicDataProps>
