import { AppIconName } from '../AppIcon'
import { BaseSizeModifier, AvatarShapeModifier } from '../types'

export interface AppAvatarProps {
  online?: boolean
  src?: string
  size?: BaseSizeModifier
  showBadge?: boolean
  stubIconName?: AppIconName
  ribbon?: boolean
  ribbonPlacement?: 'up' | 'down'
  dotPlacement?: 'up' | 'down'
  shape?: AvatarShapeModifier
  preview?: boolean
  borderless?: boolean
}
