import modifiersHandler from 'src/utils/modifiersHandler'
import IconProps from './@types/IconProps'
import IconList from './IconList'

export const UIIcon = ({ name, color, size = 'small' }: IconProps) => {
  const Icon = IconList.find((IconElement) => IconElement.name === name).Icon
  const className = modifiersHandler({ rootClass: 'ui-icon', modifiers: [size, color, name] })

  return (
    <div className={className}>
      <Icon />
    </div>
  )
}

export default UIIcon
