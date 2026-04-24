import { UnknownCallbackType } from 'common'

import { ColorModifierType } from 'src/shared/ui/internals/types'
import { AppIconNameType, AppIconSizeType } from 'src/shared/ui/AppIcon/internals/types'

export interface IButtonProps {
  htmltype?: 'button' | 'submit'
  color?: ColorModifierType
  text?: string
  ariaLabel?: string
  ariaControls?: string
  ariaExpanded?: boolean
  ariaHaspopup?: React.AriaAttributes['aria-haspopup']
  iconSize?: AppIconSizeType
  borderless?: boolean
  prefixIconName?: AppIconNameType
  loading?: boolean
  disabled?: boolean
  hoverless?: boolean
  showTooltips?: boolean
  onClick?: UnknownCallbackType
  additionalClassName?: string
  children?: React.ReactNode
  small?: boolean
  fill?: boolean
  onSubmit?: UnknownCallbackType
  info?: boolean
}
