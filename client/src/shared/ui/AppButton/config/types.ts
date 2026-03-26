import { UnknownCallback } from 'common'

import type { AppIconName, AppIconSize } from 'src/shared/ui/AppIcon'
import type { ColorModifier } from 'src/shared/ui/config'

export interface IButtonProps {
  htmltype?: 'button' | 'submit'
  color?: ColorModifier
  text?: string
  iconSize?: AppIconSize
  borderless?: boolean
  prefixIconName?: AppIconName
  loading?: boolean
  disabled?: boolean
  hoverless?: boolean
  showTooltips?: boolean
  onClick?: UnknownCallback
  additionalClassName?: string
  children?: React.ReactNode
  small?: boolean
  fill?: boolean
  onSubmit?: UnknownCallback
  info?: boolean
}
