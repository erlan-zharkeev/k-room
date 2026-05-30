import type { MediaId } from 'global-shared'

export interface AppProfilePickerItem {
  id: string
  imageId?: MediaId
  title: string
  description?: string
  online?: boolean
}

export interface AppProfilePickerProps {
  items: AppProfilePickerItem[]
  multiple?: boolean
  maxSelected?: number
  lockedIds?: string[]
  height?: string
  maxHeight?: string
}

export interface AppProfilePickerModelProps extends AppProfilePickerProps {
  lockedIds: string[]
}
