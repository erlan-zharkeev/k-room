import { HTMLAttributeAnchorTarget } from 'react'

import { UnknownCallbackType } from 'common'
import { To } from 'react-router-dom'

import { ColorModifierType } from 'src/shared/ui/config'

export interface IAppLinkProps {
  text: string
  color?: ColorModifierType
  target?: HTMLAttributeAnchorTarget
  onClick?: UnknownCallbackType
  disabled?: boolean
  prevent?: boolean
  to?: To
  href?: string
}
