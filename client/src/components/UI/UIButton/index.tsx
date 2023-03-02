import { Button, Radio, Tooltip } from 'antd'
import DropdownButton from 'antd/lib/dropdown/dropdown-button'
import useTypedSelector from 'src/hooks/useTypedSelector'
import modifiersHandler from 'src/utils/modifiersHandler'
import UIIcon from 'ui/UIIcon'
import UIButtonProps from './@types/UIButtonProps'

const buttons = [
  { name: 'common', component: Button },
  { name: 'radio', component: Radio.Button },
  { name: 'dropdown', component: DropdownButton }
]

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
  htmlType,
  size,
  shape,
  hover,
  onClick
}: UIButtonProps) => {
  const { showTooltips } = useTypedSelector((state) => state.persist.settings)
  const buttonType = type || 'common'
  const ButtonComponent = buttons.find((button) => button.name === buttonType).component
  const ButtonBody = () => (
    <ButtonComponent
      shape={shape}
      value={value}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      htmlType={htmlType}
    >
      {text}
      {iconName && <UIIcon name={iconName} color={color} size={size} />}
    </ButtonComponent>
  )
  const modifiers = modifiersHandler({ rootClass: 'ui-button', modifiers: [border, color, size, hover] })
  return (
    <div className={modifiers + ' ' + className}>
      {showTooltips && tooltip ? (
        <Tooltip placement="bottom" title={tooltip}>
          <ButtonBody />
        </Tooltip>
      ) : (
        <ButtonBody />
      )}
    </div>
  )
}

export default UIButton
