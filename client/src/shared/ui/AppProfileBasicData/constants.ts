import type { AppProfileBasicDataProps } from './types'

export const APP_PROFILE_BASIC_DATA_DEFAULT_PROPS = {
  avatarIconColor: 'var(--nmorph-accent-color)',
  avatarIconSize: '54%',
  avatarSize: 48,
  imageAlt: '',
  imageId: '',
  imageSrc: '',
  name: '',
  selectable: true,
  showOnline: false
} satisfies Partial<AppProfileBasicDataProps>
