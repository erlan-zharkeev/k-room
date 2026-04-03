import './style.scss'
import { createElement } from 'react'

import { createClassNameWithModifiers } from 'src/shared/lib'
import { IAppTextProps } from 'src/shared/ui'

export const AppText = ({
  tag = 'span',
  children,
  additionalClassName,
  color = 'text-color',
  size = 'medium',
  align = 'left',
  onClick
}: IAppTextProps) => {
  const className = createClassNameWithModifiers({
    rootClass: 'app-text',
    modifiers: [color, size, align],
    additionalClassName
  })

  return createElement(tag, { className, onClick }, children)
}
