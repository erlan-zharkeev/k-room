import './style.scss'
import { createElement } from 'react'

import { createClassNameWithModifiers } from 'src/shared/utils'

export const AppHeader = ({
  tag = 'h3',
  children,
  additionalClassName,
  accent = false,
  bold = true
}: {
  tag?: 'h2' | 'h3' | 'h4'
  children?: React.ReactNode
  additionalClassName?: string
  accent?: boolean
  bold?: boolean
}) => {
  const className = createClassNameWithModifiers({
    rootClass: 'app-header',
    modifiers: [accent && 'accent', bold && 'bold'],
    additionalClassName
  })

  return createElement(tag, { className }, children)
}
