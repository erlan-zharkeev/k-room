import { HTMLAttributeAnchorTarget } from 'react'

import { To } from 'react-router-dom'

import { UnknownCallback } from 'common'

import { ColorModifier } from 'src/shared/ui/internals/types'

export interface AppLinkProps {
  text: string
  color?: ColorModifier
  target?: HTMLAttributeAnchorTarget
  onClick?: UnknownCallback
  disabled?: boolean
  prevent?: boolean
  to?: To
  href?: string
}
