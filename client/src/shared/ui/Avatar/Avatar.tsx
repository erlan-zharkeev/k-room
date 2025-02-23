import './style.scss'
import { Badge, Image } from 'antd'
import { useState, useEffect } from 'react'
import { IconName, Icon, ShapeModifier, SizeModifier } from 'src/shared/ui'

type AvatarBadgePlacement = 'up' | 'down'
type AvatarShapeModifier = Extract<ShapeModifier, 'round' | 'square'>

export interface AvatarProps {
  online?: boolean
  src?: string
  size?: SizeModifier
  showBadge?: boolean
  stubIconName?: IconName
  ribbon?: boolean
  ribbonPlacement?: AvatarBadgePlacement
  dotPlacement?: AvatarBadgePlacement
  shape?: AvatarShapeModifier
}

export const Avatar = ({
  online,
  src,
  size = 'small',
  showBadge = true,
  stubIconName = 'user-stub',
  ribbon = false,
  ribbonPlacement = 'up',
  dotPlacement = 'up',
  shape = 'round'
}: AvatarProps) => {
  const [haveSource, setHaveSource] = useState(false)

  useEffect(() => {
    setHaveSource(Boolean(src))
  }, [src])

  const AvatarBody = () => {
    const iconSize = size === 'middle' || size === 'extra-small' || size === 'small' ? 'small' : size

    return !haveSource ? (
      <div className="avatar__image">
        <Icon name={stubIconName} size={iconSize} />
      </div>
    ) : (
      <Image src={src} className="avatar__image" alt="avatar" onError={() => setHaveSource(false)} />
    )
  }

  const BadgeWrapper = () =>
    ribbon ? (
      <Badge.Ribbon text="G" placement={ribbonPlacement === 'up' ? 'start' : 'end'}>
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
      className={`avatar avatar--${size} avatar--${shape} avatar--ribbon-${ribbonPlacement} avatar--dot-${dotPlacement}`}
    >
      <AvatarWrapper />
    </div>
  )
}
