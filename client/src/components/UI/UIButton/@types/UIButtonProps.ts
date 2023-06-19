import { ColorModifiers, SizeModifiers } from 'src/@types'
import { IconName } from '../../UIIcon/@types/IconName'

export interface UIButtonProps {
  htmltype?: 'submit'
  value?: string
  type?: 'radio' | 'dropdown' | 'common'
  tooltip?: string
  text?: string
  iconName?: IconName
  className?: string
  border?: 'borderless' | 'border-default'
  color?: ColorModifiers
  loading?: boolean
  disabled?: boolean
  size?: SizeModifiers
  shape?: 'default' | 'circle' | 'round'
  hover?: 'hoverless' | ''
  fill?: boolean
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => Promise<void> | void | any
}
