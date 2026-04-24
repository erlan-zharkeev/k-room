import './style.scss'

import { createClassNameWithModifiers } from 'src/shared/lib'
import { AppIcon } from 'src/shared/ui/AppIcon/AppIcon'

import { IButtonProps } from './internals/types'

export const AppButton = ({
  htmltype = 'button',
  color,
  text,
  ariaLabel,
  ariaControls,
  ariaExpanded,
  ariaHaspopup,
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
}: IButtonProps) => {
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
  const buttonProps = {
    type: htmltype,
    disabled,
    onClick,
    onSubmit,
    'aria-label': ariaLabel,
    'aria-controls': ariaControls,
    'aria-expanded': ariaExpanded,
    'aria-haspopup': ariaHaspopup,
    'aria-busy': loading ? true : undefined
  }

  return (
    <div className={className}>
      <button {...buttonProps}>
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
