import './style.scss'

import type { IButtonProps } from 'src/shared/ui/AppButton/config'
import { AppIcon } from 'src/shared/ui/AppIcon'
import { createClassNameWithModifiers } from 'src/shared/utils'

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
