import './style.scss'

import { UnknownCallback } from 'common-types'

import { createClassNameWithModifiers } from 'src/shared/utils'

import { AppIcon } from '../AppIcon'
import { AppIconName, AppIconSize } from '../AppIcon/types'
import { ColorModifier } from '../types'

export interface ButtonProps {
  htmltype?: 'button' | 'submit'
  color?: ColorModifier
  text?: string
  iconSize?: AppIconSize
  borderless?: boolean
  prefixIconName?: AppIconName
  loading?: boolean
  disabled?: boolean
  hoverless?: boolean
  showTooltips?: boolean
  onClick?: UnknownCallback
  additionalClassName?: string
  children?: React.ReactNode
  small?: boolean
  fill?: boolean
  onSubmit?: UnknownCallback
  info?: boolean
}

export const AppButton = ({
  htmltype = 'button',
  color,
  text,
  borderless,
  iconSize = 'xs',
  prefixIconName,
  loading,
  disabled,
  hoverless,
  onClick = () => {},
  additionalClassName,
  children,
  small = false,
  fill = false,
  onSubmit = () => {},
  info = false
}: ButtonProps) => {
  const className = createClassNameWithModifiers({
    rootClass: 'app-button',
    modifiers: [
      color,
      loading && 'loading',
      borderless && 'borderless',
      hoverless && 'hoverless',
      disabled && 'disabled',
      small && 'small',
      fill && 'fill',
      info && 'info'
    ],
    additionalClassName
  })

  return (
    <div className={className}>
      <button type={htmltype} disabled={disabled} onClick={onClick} onSubmit={onSubmit}>
        {loading && <AppIcon name="loader" color={`${color ?? 'accent-color'}`} size={iconSize} />}
        {!loading && (
          <>
            {prefixIconName && <AppIcon name={prefixIconName} color={color} size={iconSize} />}
            {text && <span>{text}</span>}
            {children}
          </>
        )}
      </button>
    </div>
  )
}
