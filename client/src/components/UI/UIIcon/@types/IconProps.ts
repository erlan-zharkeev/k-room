import { ColorModifiers, SizeModifiers } from 'src/@types'
import { IconName } from 'ui/UIIcon/@types/IconName'

export interface IconProps {
  name: IconName
  color?: ColorModifiers
  size?: SizeModifiers
}
