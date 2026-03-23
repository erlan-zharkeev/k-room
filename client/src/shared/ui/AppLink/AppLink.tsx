// AppLink.tsx
import './style.scss'
import { UnknownCallback } from 'common-types'
import { Link as RouterLink, type To } from 'react-router-dom'

import { createClassNameWithModifiers } from 'src/shared/utils'

import type { ColorModifier } from '../config'

interface Props {
  text: string
  color?: ColorModifier
  target?: React.HTMLAttributeAnchorTarget
  onClick?: UnknownCallback
  disabled?: boolean
  prevent?: boolean
  to?: To // <-- для внутренней навигации (SPA)
  href?: string // <-- для внешних ссылок
}

export const AppLink = ({
  text,
  color,
  target = '_blank',
  onClick = () => {},
  disabled = false,
  prevent = false,
  to,
  href = ''
}: Props) => {
  const className = createClassNameWithModifiers({
    rootClass: 'app-link',
    modifiers: [disabled && 'disabled', color]
  })

  if (to) {
    return (
      <RouterLink
        className={className}
        to={to}
        // для внутренних ссылок target почти всегда _self
        target="_self"
        onClick={(e) => {
          if (prevent) e.preventDefault()
          onClick?.(e)
        }}
      >
        {text}
      </RouterLink>
    )
  }

  return (
    <a
      className={className}
      href={href}
      target={target}
      rel="noreferrer"
      onClick={(e) => {
        if (prevent) e.preventDefault()
        onClick?.(e)
      }}
    >
      {text}
    </a>
  )
}
