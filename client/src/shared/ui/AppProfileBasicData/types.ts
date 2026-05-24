import type { MediaId } from 'global-shared'

export interface AppProfileBasicDataProps {
  imageAlt?: string
  imageId?: MediaId
  imageSrc?: string
  title: string
  name?: string
  selectable?: boolean
  showOnline?: boolean
}
