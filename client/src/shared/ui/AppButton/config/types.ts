import { UnknownCallback } from 'common-types'

import type { AppIconName, AppIconSize } from '../../AppIcon'
import type { ColorModifier } from '../../config'

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
