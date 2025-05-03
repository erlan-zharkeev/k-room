import './style.scss'

import { createClassNameWithModifiers } from 'src/shared/utils'

export const AppLink = ({
  href = '',
  text,
  target = '_blank',
  onClick = () => {},
  disabled = false
}: {
  href?: string
  text: string
  target?: React.HTMLAttributeAnchorTarget
  onClick?: (...args: unknown[]) => void
  disabled?: boolean
}) => {
  const className = createClassNameWithModifiers({
    rootClass: 'app-link',
    modifiers: [disabled && 'disabled']
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
