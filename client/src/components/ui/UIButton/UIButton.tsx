import { Button, Radio, Dropdown, Tooltip } from 'antd'
import { useTypedSelector } from 'src/hooks'
import { modifiersHandler } from 'src/utils'
import { UIIcon } from '..'
import { ColorModifiers, SizeModifiers } from 'src/@types'
import { IconName } from '../UIIcon/UIIcon'

export interface UIButtonProps {
  htmltype?: 'button' | 'submit'
  value?: string
  type?: 'radio' | 'dropdown' | 'common'
  tooltip?: string
  text?: string
  iconName?: IconName
  className?: string
  border?: 'borderless' | 'border-default'
  color?: ColorModifiers
  loading?: boolean
  disabled?: boolean
  size?: SizeModifiers
  shape?: 'default' | 'circle' | 'round'
  hover?: 'hoverless' | ''
  fill?: boolean
  fillBg?: ColorModifiers
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const UIButton = ({
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
}: UIButtonProps) => {
  const { showTooltips } = useTypedSelector((state) => state.persist.settings)

  const buttons = {
    common: Button,
    radio: Radio.Button,
    dropdown: Dropdown.Button
  }
  const ButtonComponent = buttons[type]
  const hasIconAndText = iconName && text
  const htmlPropAntdErrorFix = type === 'common' ? { htmlType: htmltype } : {}
  const ButtonBody = () => (
    <ButtonComponent
      {...htmlPropAntdErrorFix}
      shape={shape}
      value={value}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
    >
      {iconName && <UIIcon name={iconName} color={color} size={size} />}
      <span style={{ marginLeft: hasIconAndText ? '4px' : '0' }}>{text}</span>
    </ButtonComponent>
  )
  const modifiers = modifiersHandler({
    rootClass: 'ui-button',
    modifiers: [border, color, size, hover, fillBg === 'default' ? '' : `${fillBg}-bg`, fill ? 'fill' : '']
  })

  return (
    <div className={modifiers + ' ' + className}>
      {showTooltips && tooltip ? (
        <Tooltip title={tooltip} showArrow={false} destroyTooltipOnHide={true} placement="top">
          <div className="tooltip-content">
            <ButtonBody />
          </div>
        </Tooltip>
      ) : (
        <ButtonBody />
      )}
    </div>
  )
}
