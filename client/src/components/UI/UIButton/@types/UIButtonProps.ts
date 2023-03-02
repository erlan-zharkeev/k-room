import { ColorModifiers, SizeModifiers } from 'src/@types'
import { IconName } from '../../UIIcon/@types/IconName'

export default interface UIButtonProps {
  htmlType?: 'submit'
  value?: string
  type?: 'radio' | 'dropdown' | 'common'
  tooltip?: string
  text?: string
  iconName?: IconName
  className?: string
  border?: 'borderless' | 'default'
  color?: ColorModifiers
  loading?: boolean
  disabled?: boolean
  size?: SizeModifiers
  shape?: 'default' | 'circle' | 'round'
  hover?: 'hoverless' | ''
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => Promise<void> | void
}
