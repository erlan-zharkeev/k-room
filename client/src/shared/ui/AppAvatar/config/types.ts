import type { AppIconNameType } from '../../AppIcon'
import type { BaseSizeModifierType, AvatarShapeModifierType } from '../../config'

export interface IAppAvatarProps {
  online?: boolean
  src?: string
  size?: BaseSizeModifierType
  showBadge?: boolean
  stubIconName?: AppIconNameType
  ribbon?: boolean
  ribbonPlacement?: 'up' | 'down'
  dotPlacement?: 'up' | 'down'
  shape?: AvatarShapeModifierType
  preview?: boolean
  borderless?: boolean
}
