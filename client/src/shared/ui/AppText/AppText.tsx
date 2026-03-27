import './style.scss'
import { createElement } from 'react'

import type { ColorModifierType, ExtendedSizeModifierType } from 'src/shared/ui/config'
import { createClassNameWithModifiers } from 'src/shared/utils'

export const AppText = ({
  tag = 'span',
  children,
  additionalClassName,
  color = 'text-color',
  size = 'medium',
  align = 'left',
  onClick
}: {
  tag?: 'span' | 'p'
  children?: React.ReactNode
  additionalClassName?: string
  color?: ColorModifierType
  size?: ExtendedSizeModifierType
  align?: 'left' | 'center' | 'right'
  onClick?: (e: React.MouseEvent<HTMLElement>) => void | Promise<void>
}) => {
  const className = createClassNameWithModifiers({
    rootClass: 'app-text',
    modifiers: [color, size, align],
    additionalClassName
  })

  return createElement(tag, { className, onClick }, children)
}
