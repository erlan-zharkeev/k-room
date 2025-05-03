import './style.scss'

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
  onClick?: (...args: unknown[]) => void | Promise<void>
  additionalClassName?: string
  children?: React.ReactNode
}

const rootClass = 'app-button'

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
  children
}: ButtonProps) => {
  const className = createClassNameWithModifiers({
    rootClass,
    modifiers: [
      color,
      loading && 'loading',
      borderless && 'borderless',
      hoverless && 'hoverless',
      disabled && 'disabled'
    ],
    additionalClassName
  })

  return (
    <div className={className}>
      <button type={htmltype} disabled={disabled} onClick={onClick}>
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
