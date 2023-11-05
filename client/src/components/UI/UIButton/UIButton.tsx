import { Button, Dropdown, Radio, Tooltip } from 'antd'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { modifiersHandler } from 'src/utils/modifiersHandler'
import { UIButtonProps } from './@types/UIButtonProps'
import { UIIcon } from '..'

const UIButton = ({
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
    modifiers: [border, color, size, hover, fill ? 'fill' : '']
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

export default UIButton
