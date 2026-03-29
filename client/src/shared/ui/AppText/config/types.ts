import type { ColorModifierType, ExtendedSizeModifierType } from 'src/shared/ui/config'

export interface IAppTextProps {
  tag?: 'span' | 'p' | 'div'
  children?: React.ReactNode
  additionalClassName?: string
  color?: ColorModifierType
  size?: ExtendedSizeModifierType
  align?: 'left' | 'center' | 'right'
  onClick?: (e: React.MouseEvent<HTMLElement>) => void | Promise<void>
}
