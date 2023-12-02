import { Badge, Image } from 'antd'
import { useState, useEffect } from 'react'
import { UIIcon } from '..'
import { BadgePlacement, UIAvatarProps } from './@types/UIAvatarProps'

export const UIAvatar = ({
  online,
  src,
  size = 'small',
  showBadge = true,
  stubIconName = 'user-stub',
  ribbon = false,
  ribbonPlacement = BadgePlacement.up,
  dotPlacement = BadgePlacement.up,
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
      <Badge.Ribbon text="G" placement={ribbonPlacement === BadgePlacement.up ? 'start' : 'end'}>
        <AvatarBody />
      </Badge.Ribbon>
    ) : (
      <Badge dot color={online ? 'green' : 'red'}>
        <AvatarBody />
      </Badge>
    )

  const AvatarWrapper = () => (showBadge ? <BadgeWrapper /> : <AvatarBody />)

  return (
    <div
      className={`ui-avatar ui-avatar--${size} ui-avatar--${shape} ui-avatar--ribbon-${ribbonPlacement} ui-avatar--dot-${dotPlacement}`}
    >
      <AvatarWrapper />
    </div>
  )
}
