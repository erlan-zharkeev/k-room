import { AppIconNameType } from 'src/shared/ui/AppIcon'
import { BaseSizeModifierType, AvatarShapeModifierType } from 'src/shared/ui/config'

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
