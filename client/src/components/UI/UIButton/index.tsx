import { Button, Radio, Tooltip } from 'antd'
import DropdownButton from 'antd/lib/dropdown/dropdown-button'
import useTypedSelector from 'src/hooks/useTypedSelector'
import modifiersHandler from 'src/utils/modifiersHandler'
import UIIcon from 'ui/UIIcon'
import UIButtonProps from './@types/UIButtonProps'

const buttons = {
  common: Button,
  radio: Radio.Button,
  dropdown: DropdownButton
}

export const UIButton = ({
  type,
  value,
  tooltip,
  text,
  iconName,
  className = '',
  border = 'borderless',
  color,
  loading,
  disabled,
  htmltype,
  size,
  shape,
  hover,
  fill = false,
  onClick
}: UIButtonProps) => {
  const { showTooltips } = useTypedSelector((state) => state.persist.settings)
  const buttonType = type || 'common'
  const ButtonComponent = buttons[buttonType]
  const hasIconAndText = iconName && text

  const ButtonBody = () => (
    <ButtonComponent
      shape={shape}
      value={value}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      htmlType={htmltype}
    >
      {iconName && <UIIcon name={iconName} color={color} size={size} />}
      <span style={{ marginLeft: hasIconAndText ? '4px' : '0' }}>{text}</span>
    </ButtonComponent>
  )
  const modifiers = modifiersHandler({
    rootClass: 'ui-button',
    modifiers: [border, color, size, hover, fill === true ? 'fill' : '']
  })
  return (
    <div className={modifiers + ' ' + className}>
      {showTooltips && tooltip ? (
        <Tooltip title={tooltip}>
          <></>
          <ButtonBody />
        </Tooltip>
      ) : (
        <ButtonBody />
      )}
    </div>
  )
}

export default UIButton
