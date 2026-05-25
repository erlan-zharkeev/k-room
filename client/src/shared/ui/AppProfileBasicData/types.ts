import type { MediaId } from 'global-shared'

export interface AppProfileBasicDataProps {
  avatarSize?: number
  imageAlt?: string
  imageId?: MediaId
  imageSrc?: string
  title: string
  name?: string
  selectable?: boolean
  showOnline?: boolean
}
