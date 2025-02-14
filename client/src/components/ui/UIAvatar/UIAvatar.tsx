import { Badge, Image } from 'antd'
import { useState, useEffect } from 'react'
import { ShapeModifier, SizeModifier } from 'src/@types'
import { IconName, UIIcon } from '..'

enum UIAvatarBadgePlacement {
  Up = 'up',
  Down = 'down'
}

type UIAvatarShapeModifier = Extract<ShapeModifier, 'round' | 'square'>

export interface UIAvatarProps {
  online?: boolean
  src?: string
  size?: SizeModifier
  showBadge?: boolean
  stubIconName?: IconName
  ribbon?: boolean
  ribbonPlacement?: UIAvatarBadgePlacement
  dotPlacement?: UIAvatarBadgePlacement
  shape?: UIAvatarShapeModifier
}

export const UIAvatar = ({
  online,
  src,
  size = 'small',
  showBadge = true,
  stubIconName = 'user-stub',
  ribbon = false,
  ribbonPlacement = UIAvatarBadgePlacement.Up,
  dotPlacement = UIAvatarBadgePlacement.Up,
  shape = 'round'
}: UIAvatarProps) => {
  const [haveSource, setHaveSource] = useState(false)

  useEffect(() => {
    setHaveSource(Boolean(src))
  }, [src])

  const AvatarBody = () => {
    const iconSize = size === 'middle' || size === 'extra-small' || size === 'small' ? 'small' : size

    return !haveSource ? (
      <div className="ui-avatar__image">
        <UIIcon name={stubIconName} size={iconSize} />
      </div>
    ) : (
      <Image src={src} className="ui-avatar__image" alt="avatar" onError={() => setHaveSource(false)} />
    )
  }

  const BadgeWrapper = () =>
    ribbon ? (
      <Badge.Ribbon text="G" placement={ribbonPlacement === UIAvatarBadgePlacement.Up ? 'start' : 'end'}>
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
