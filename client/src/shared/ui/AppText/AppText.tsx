import './style.scss'
import { createElement } from 'react'

import { createClassNameWithModifiers } from 'src/shared/utils'

import { BaseSizeModifier } from '../types'

export const AppText = ({
  tag = 'span',
  children,
  additionalClassName,
  accent = false,
  size = 'medium',
  align = 'left',
  onClick
}: {
  tag?: 'span' | 'p'
  children?: React.ReactNode
  additionalClassName?: string
  accent?: boolean
  size?: BaseSizeModifier
  align?: 'left' | 'center' | 'right'
  onClick?: (e: React.MouseEvent<HTMLElement>) => void | Promise<void>
}) => {
  const className = createClassNameWithModifiers({
    rootClass: 'app-text',
    modifiers: [accent && 'accent', size, align],
    additionalClassName
  })

  return createElement(tag, { className, onClick }, children)
}
