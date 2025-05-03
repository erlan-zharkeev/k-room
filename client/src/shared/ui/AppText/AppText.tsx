import './style.scss'
import { createElement } from 'react'

import { createClassNameWithModifiers } from 'src/shared/utils'

export const AppText = ({
  tag = 'span',
  children,
  additionalClassName,
  accent = false,
  size = 'md'
}: {
  tag?: 'span' | 'p'
  children?: React.ReactNode
  additionalClassName?: string
  accent?: boolean
  size?: 'sm' | 'md' | 'lg'
}) => {
  const className = createClassNameWithModifiers({
    rootClass: 'app-text',
    modifiers: [accent && 'accent', size],
    additionalClassName
  })

  return createElement(tag, { className }, children)
}
