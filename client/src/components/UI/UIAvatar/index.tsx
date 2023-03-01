import { Badge, Avatar, Image } from 'antd'
import UIIcon from 'ui/UIIcon'
import UIAvatarProps from 'ui/UIAvatar/@types/UIAvatarProps'

export const UIAvatar = ({ online, src, size = 'small', showBadge = true }: UIAvatarProps) => {
  const AvatarBody = () =>
    src ? (
      <Image src={src} className="ui-avatar__image" alt="avatar" />
    ) : (
      <Avatar src={src} className="ui-avatar__image" icon={<UIIcon name="user-stub" size={size} />} alt="avatar" />
    )
  const AvatarWrapper = () =>
    showBadge ? (
      <Badge dot color={online ? 'green' : 'red'}>
        <AvatarBody />
      </Badge>
    ) : (
      <AvatarBody />
    )

  return (
    <div className={`ui-avatar ui-avatar--${size}`}>
      <AvatarWrapper />
    </div>
  )
}

export default UIAvatar
