export interface AppUserPickerItem {
  id: string
  imageId?: string
  nickname: string
  online?: boolean
}

export interface AppUserPickerProps {
  items: AppUserPickerItem[]
  multiple?: boolean
  maxSelected?: number
  lockedIds?: string[]
  height?: string
  maxHeight?: string
}

export interface AppUserPickerModelProps extends AppUserPickerProps {
  lockedIds: string[]
}
