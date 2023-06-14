import { Badge, Image } from 'antd'
import { useEffect, useState } from 'react'
import UIIcon from 'src/components/UI/UIIcon/UIIcon'
import { UIAvatarProps } from 'ui/UIAvatar/@types/UIAvatarProps'

const UIAvatar = ({
  online,
  src,
  size = 'small',
  showBadge = true,
  stubIconName = 'user-stub',
  ribbon = false,
  shape = 'round'
}: UIAvatarProps) => {
  const [haveSource, setHaveSource] = useState(false)

  useEffect(() => {
    setHaveSource(Boolean(src))
  }, [src])

  const AvatarBody = () => {
    return !haveSource ? (
      <div className="ui-avatar__image">
        <UIIcon name={stubIconName} size={size} />
      </div>
    ) : (
      <Image src={src} className="ui-avatar__image" alt="avatar" onError={() => setHaveSource(false)} />
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
