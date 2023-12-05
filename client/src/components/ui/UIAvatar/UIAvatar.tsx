import { Badge, Image } from 'antd'
import { useState, useEffect } from 'react'
import { SizeModifiers, ShapeModifiers, UIAvatarBadgePlacement } from 'src/@types'
import { IconName, UIIcon } from '..'
export interface UIAvatarProps {
  online?: boolean
  src?: string
  size?: SizeModifiers
  showBadge?: boolean
  stubIconName?: IconName
  ribbon?: boolean
  ribbonPlacement?: UIAvatarBadgePlacement
  dotPlacement?: UIAvatarBadgePlacement
  shape?: ShapeModifiers
}

export const UIAvatar = ({
  online,
  src,
  size = 'small',
  showBadge = true,
  stubIconName = 'user-stub',
  ribbon = false,
  ribbonPlacement = UIAvatarBadgePlacement.up,
  dotPlacement = UIAvatarBadgePlacement.up,
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
      <Badge.Ribbon text="G" placement={ribbonPlacement === UIAvatarBadgePlacement.up ? 'start' : 'end'}>
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
