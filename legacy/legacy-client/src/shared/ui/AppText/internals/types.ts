import { ColorModifier, ExtendedSizeModifier } from 'src/shared/ui/internals/types'

export interface AppTextProps {
  tag?: 'span' | 'p' | 'div'
  children?: React.ReactNode
  additionalClassName?: string
  color?: ColorModifier
  size?: ExtendedSizeModifier
  align?: 'left' | 'center' | 'right'
  onClick?: (e: React.MouseEvent<HTMLElement>) => void | Promise<void>
}
