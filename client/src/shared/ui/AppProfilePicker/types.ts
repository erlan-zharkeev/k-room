import type { MediaId } from 'global-shared'
import type { Component } from 'vue'

export interface AppProfilePickerItem {
  id: string
  avatarIcon?: string | Component
  avatarIconColor?: string
  avatarIconSize?: string
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
