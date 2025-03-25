import './style.scss'
import { Tooltip } from 'antd'
import { AppIconName, AppIconSize } from '../AppIcon/types'
import { useMemo } from 'react'
import { AppIcon } from '../AppIcon'
import { ColorModifier } from '../types'
import { createClassNameWithModifiers } from 'src/shared/utils'

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
  tooltip?: string
  onClick?: (...args: unknown[]) => void | Promise<void>
  additionalClassName?: string
}

const rootClass = 'app-button'

export const AppButton = ({
  htmltype = 'button',
  color,
  text,
  tooltip,
  borderless,
  iconSize = 'xs',
  prefixIconName,
  loading,
  disabled,
  hoverless,
  showTooltips,
  onClick = () => {},
  additionalClassName
}: ButtonProps) => {
  const ButtonBody = useMemo(() => {
    return (
      <button type={htmltype} disabled={disabled} onClick={onClick}>
        {loading && <AppIcon name="loader" color={color} size={iconSize} />}
        {!loading && (
          <>
            {prefixIconName && <AppIcon name={prefixIconName} color={color} size={iconSize} />}
            {text && <span>{text}</span>}
          </>
        )}
      </button>
    )
  }, [htmltype, disabled, onClick, prefixIconName, color, text])

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
      {showTooltips && tooltip ? (
        <Tooltip title={tooltip} showArrow={false} destroyTooltipOnHide={true} placement="top">
          <div className="tooltip-content">{ButtonBody}</div>
        </Tooltip>
      ) : (
        ButtonBody
      )}
    </div>
  )
}
