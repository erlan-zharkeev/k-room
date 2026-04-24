import { HTMLAttributeAnchorTarget } from 'react'

import { To } from 'react-router-dom'

import { UnknownCallbackType } from 'common'

import { ColorModifierType } from 'src/shared/ui/internals/types'

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
