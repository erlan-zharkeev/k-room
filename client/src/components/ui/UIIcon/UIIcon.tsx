import { modifiersHandler } from 'src/utils'
import { IconList } from './IconList'
import { IconType } from 'react-icons'
import { ColorModifiers, ExpandedSizeModifiers } from 'src/@types'

export interface IconListElement {
  name: IconName
  Icon: IconType
}

export interface IconProps {
  name: IconName
  color?: ColorModifiers
  size?: ExpandedSizeModifiers
}

export type IconName =
  | 'shield'
  | 'contacts'
  | 'chat'
  | 'chats'
  | 'calls'
  | 'settings-cog'
  | 'settings-mixer'
  | 'notification-bell'
  | 'exit'
  | 'user-stub'
  | 'loader'
  | 'call'
  | 'cross'
  | 'search'
  | 'plus'
  | 'emoji'
  | 'send'
  | 'paper-clip'
  | 'mail'
  | 'video-call'
  | 'video-call-thin'
  | 'phone-call'
  | 'info'
  | 'arrow-left'
  | 'phone-drop'
  | 'mic'
  | 'mic-muted'
  | 'video-drop'
  | 'cross-2'
  | 'dash'
  | 'expand'
  | 'google'
  | 'facebook'
  | 'reply'
  | 'forward'
  | 'exclamation'
  | 'image-stub'
  | 'trash'
  | 'warn'
  | 'thunder'

export const UIIcon = ({ name, color, size = 'small' }: IconProps) => {
  const Icon = IconList.find((IconElement) => IconElement.name === name)?.Icon
  const className = modifiersHandler({ rootClass: 'ui-icon', modifiers: [size, color, name] })
  return <div className={className}>{Icon && <Icon />}</div>
}
