import { Badge, Image } from 'antd'
import UIIcon from 'ui/UIIcon'
import UIAvatarProps from 'ui/UIAvatar/@types/UIAvatarProps'

export const UIAvatar = ({
  online,
  src,
  size = 'small',
  showBadge = true,
  stubIconName = 'user-stub',
  ribbon = false,
  shape = 'round'
}: UIAvatarProps) => {
  const haveSource = Boolean(src)

  const AvatarBody = () => {
    return haveSource ? (
      <Image src={src} className="ui-avatar__image" alt="avatar" />
    ) : (
      <div className="ui-avatar__image">
        <UIIcon name={stubIconName} size={size} />
      </div>
    )
  }

  const BadgeWrapper = () =>
    ribbon ? (
      <Badge.Ribbon text="G" placement="start">
        <AvatarBody />
      </Badge.Ribbon>
    ) : (
      <Badge dot color={online ? 'green' : 'red'}>
        <AvatarBody />
      </Badge>
    )

  const AvatarWrapper = () => (showBadge ? <BadgeWrapper /> : <AvatarBody />)

  return (
    <div className={`ui-avatar ui-avatar--${size} ui-avatar--${shape}`}>
      <AvatarWrapper />
    </div>
  )
}

export default UIAvatar
