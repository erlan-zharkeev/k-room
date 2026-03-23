import { AppIconName } from '../AppIcon'
import type { BaseSizeModifier, AvatarShapeModifier } from '../../config'

export interface IAppAvatarProps {
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
