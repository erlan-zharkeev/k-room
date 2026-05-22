export interface AppUserPickerItem {
  id: string
  imageId?: string
  nickname: string
  online?: boolean
}

export interface AppUserPickerProps {
  items: AppUserPickerItem[]
  multiple?: boolean
  height?: string
  maxHeight?: string
}
