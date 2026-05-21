export interface IAppUserPickerItem {
  id: string
  imageId?: string
  nickname: string
  online?: boolean
}

export interface IAppUserPickerProps {
  items: IAppUserPickerItem[]
  multiple?: boolean
  height?: string
  maxHeight?: string
}
