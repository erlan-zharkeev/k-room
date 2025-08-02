import './style.scss'

import { UnknownCallback } from 'common-types'

import { createClassNameWithModifiers } from 'src/shared/utils'

import type { ColorModifier } from '../types'

export const AppLink = ({
  href = '',
  text,
  color,
  target = '_blank',
  onClick = () => {},
  disabled = false
}: {
  href?: string
  text: string
  color?: ColorModifier
  target?: React.HTMLAttributeAnchorTarget
  onClick?: UnknownCallback
  disabled?: boolean
}) => {
  const className = createClassNameWithModifiers({
    rootClass: 'app-link',
    modifiers: [disabled && 'disabled', color]
  })

  return (
    <a
      onClick={(e) => {
        e.preventDefault()
        onClick?.(e)
      }}
      className={className}
      target={target}
      href={href}
      rel="noreferrer"
    >
      {text}
    </a>
  )
}
