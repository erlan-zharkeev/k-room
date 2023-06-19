import { ShapeModifiers, SizeModifiers } from 'src/@types'
import { IconName } from '../../UIIcon/@types/IconName'

export interface UIAvatarProps {
  online?: boolean
  src?: string
  size?: SizeModifiers
  showBadge?: boolean
  stubIconName?: IconName
  ribbon?: boolean
  shape?: ShapeModifiers
}
