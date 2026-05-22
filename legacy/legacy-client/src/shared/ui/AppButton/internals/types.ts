import { UnknownCallback } from 'common'

import { ColorModifier } from 'src/shared/ui/internals/types'
import { AppIconName, AppIconSize } from 'src/shared/ui/AppIcon/internals/types'

export interface ButtonProps {
  htmltype?: 'button' | 'submit'
  color?: ColorModifier
  text?: string
  ariaLabel?: string
  ariaControls?: string
  ariaExpanded?: boolean
  ariaHaspopup?: React.AriaAttributes['aria-haspopup']
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
