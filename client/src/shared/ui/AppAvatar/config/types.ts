import type { AppIconName } from 'src/shared/ui/AppIcon'
import type { BaseSizeModifier, AvatarShapeModifier } from 'src/shared/ui/config'

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
