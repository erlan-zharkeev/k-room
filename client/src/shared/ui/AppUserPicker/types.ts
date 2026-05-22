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
  height?: string
  maxHeight?: string
}
