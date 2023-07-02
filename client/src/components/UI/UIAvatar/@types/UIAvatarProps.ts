import { ShapeModifiers, SizeModifiers } from 'src/@types'
import { IconName } from '../../UIIcon/@types/IconName'

export enum BadgePlacement {
  up = 'up',
  down = 'down'
}
export interface UIAvatarProps {
  online?: boolean
  src?: string
  size?: SizeModifiers
  showBadge?: boolean
  stubIconName?: IconName
  ribbon?: boolean
  ribbonPlacement?: BadgePlacement
  dotPlacement?: BadgePlacement
  shape?: ShapeModifiers
}
