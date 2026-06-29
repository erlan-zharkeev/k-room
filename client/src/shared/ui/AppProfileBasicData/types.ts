import type { MediaId } from 'global-shared'
import type { Component } from 'vue'

export interface AppProfileBasicDataProps {
  avatarSize?: number
  avatarIcon?: string | Component
  avatarIconColor?: string
  avatarIconSize?: string
  imageAlt?: string
  imageId?: MediaId
  imageSrc?: string
  title: string
  name?: string
  selectable?: boolean
  showOnline?: boolean
}
