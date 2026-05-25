import type { AppProfileBasicDataProps } from './types'

export const APP_PROFILE_BASIC_DATA_DEFAULT_PROPS = {
  avatarSize: 48,
  imageAlt: '',
  imageId: '',
  imageSrc: '',
  name: '',
  selectable: true,
  showOnline: false
} satisfies Partial<AppProfileBasicDataProps>
