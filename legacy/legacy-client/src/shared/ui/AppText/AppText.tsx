import './style.scss'
import { createElement } from 'react'

import { createClassNameWithModifiers } from 'src/shared/lib'
import { AppTextProps } from 'src/shared/ui/AppText/internals/types'

export const AppText = ({
  tag = 'span',
  children,
  additionalClassName,
  color = 'text-color',
  size = 'medium',
  align = 'left',
  onClick
}: AppTextProps) => {
  const className = createClassNameWithModifiers({
    rootClass: 'app-text',
    modifiers: [color, size, align],
    additionalClassName
  })

  return createElement(tag, { className, onClick }, children)
}
