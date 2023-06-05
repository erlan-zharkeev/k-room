import { Badge, Avatar, Image } from 'antd'
import UIIcon from 'ui/UIIcon'
import UIAvatarProps from 'ui/UIAvatar/@types/UIAvatarProps'
import { useState } from 'react'

export const UIAvatar = ({
  online,
  src,
  size = 'small',
  showBadge = true,
  stubIconName = 'user-stub'
}: UIAvatarProps) => {
  const [showImage, setShowImage] = useState(Boolean(src))

  const AvatarBody = () =>
    showImage ? (
      <Image src={src} className="ui-avatar__image" alt="avatar" onError={() => setShowImage(false)} />
    ) : (
      <Avatar src={src} className="ui-avatar__image" icon={<UIIcon name={stubIconName} size={size} />} alt="avatar" />
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
