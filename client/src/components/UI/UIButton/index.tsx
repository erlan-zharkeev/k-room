import { Button, Radio, Tooltip } from 'antd'
import DropdownButton from 'antd/lib/dropdown/dropdown-button'
import useTypedSelector from 'src/hooks/useTypedSelector'
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
  className,
  borderless = true,
  color,
  loading,
  disabled,
  htmlType,
  size,
  shape,
  noHover,
  onClick
}: UIButtonProps) => {
  const { showTooltips } = useTypedSelector((state) => state.persist.settings)
  const buttonType = type ? type : 'common'
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
      {iconName && <UIIcon name={iconName} color={color} />}
    </ButtonComponent>
  )
  return (
    <div
      className={`ui-button ${borderless ? 'ui-button--borderless' : ''} ${color ? `ui-button--${color}` : ''} ${
        size ? `ui-button--${size}` : ''
      } ${className ?? ''} ${noHover ? 'ui-button--hoverless' : ''}`}
    >
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
