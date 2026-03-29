import type { UnknownCallbackType } from 'common'

import type { AppIconNameType, AppIconSizeType } from '../../AppIcon'
import type { ColorModifierType } from '../../config'

export interface IButtonProps {
  htmltype?: 'button' | 'submit'
  color?: ColorModifierType
  text?: string
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
