import { SizeModifiers } from 'src/@types'
import { IconName } from '../../UIIcon/@types/IconName'

export default interface UIAvatarProps {
  online?: boolean
  src?: string
  size?: SizeModifiers
  showBadge?: boolean
  stubIconName?: IconName
}
