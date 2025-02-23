import './style.scss'
import { Button as AntdButton, Radio, Dropdown, Tooltip } from 'antd'
import { IconName, Icon, ColorModifier, ShapeModifier, SizeModifier } from 'src/shared/ui'
import { useMemo } from 'react'
import { modifiersHandler } from 'src/shared/utils'
import { useTypedSelector } from 'src/shared/lib'

type ButtonColorModifier = Extract<ColorModifier, 'accent' | 'success' | 'default' | 'error'>
type ButtonShapeModifier = Extract<ShapeModifier, 'default' | 'circle' | 'round'>
type ButtonSizeModifier = Extract<SizeModifier, 'small'>

export interface ButtonProps {
  htmltype?: 'button' | 'submit'
  value?: string
  type?: 'radio' | 'dropdown' | 'common'
  tooltip?: string
  text?: string
  iconName?: IconName
  className?: string
  border?: 'borderless' | 'common-border'
  color?: ButtonColorModifier
  loading?: boolean
  disabled?: boolean
  size?: ButtonSizeModifier
  shape?: ButtonShapeModifier
  hover?: 'hoverless' | ''
  fill?: boolean
  fillBg?: ButtonColorModifier
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const Button = ({
  type = 'common',
  value,
  tooltip,
  text,
  iconName,
  className = '',
  border = 'borderless',
  color,
  loading,
  disabled,
  size,
  htmltype = 'button',
  shape,
  hover,
  fill = false,
  fillBg = 'default',
  onClick
}: ButtonProps) => {
  const { showTooltips } = useTypedSelector((state) => state.persist.settings)

  const buttons = {
    common: AntdButton,
    radio: Radio.Button,
    dropdown: Dropdown.Button
  }

  const hasIconAndText = iconName && text
  const htmlPropAntdErrorFix = type === 'common' ? { htmlType: htmltype } : {}

  const ButtonBody = useMemo(() => {
    const ButtonComponent = buttons[type]
    return (
      <ButtonComponent
        {...htmlPropAntdErrorFix}
        shape={shape}
        value={value}
        onClick={onClick}
        loading={loading}
        disabled={disabled}
      >
        {iconName && <Icon name={iconName} color={color} size={size} />}
        <span style={{ marginLeft: hasIconAndText ? '4px' : '0' }}>{text}</span>
      </ButtonComponent>
    )
  }, [
    type,
    htmlPropAntdErrorFix,
    shape,
    value,
    onClick,
    loading,
    disabled,
    iconName,
    color,
    size,
    text,
    hasIconAndText
  ])

  const modifiers = modifiersHandler({
    rootClass: 'button',
    modifiers: [border, color, size, hover, fillBg === 'default' ? '' : `${fillBg}-bg`, fill ? 'fill' : '']
  })

  return (
    <div className={`${modifiers}${className ? ` ${className}` : ''}`}>
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
