import { UnknownCallbackType } from 'common'

import { AppIconNameType, AppIconSizeType } from 'src/shared/ui/AppIcon'
import { ColorModifierType } from 'src/shared/ui/config'

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
