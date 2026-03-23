import type { ColorModifier, ExtendedSizeModifier } from '../../config'

export interface IAppTextProps {
  tag?: 'span' | 'p'
  children?: React.ReactNode
  additionalClassName?: string
  color?: ColorModifier
  size?: ExtendedSizeModifier
  align?: 'left' | 'center' | 'right'
  onClick?: (e: React.MouseEvent<HTMLElement>) => void | Promise<void>
}
