import './style.scss'
import { Badge, Image } from 'antd'
import { useState, useEffect } from 'react'
import { AppIconName, AppIcon, SizeModifier, AvatarLoaderShapeModifier } from 'src/shared/ui'

export interface AvatarProps {
  online?: boolean
  src?: string
  size?: SizeModifier
  showBadge?: boolean
  stubIconName?: AppIconName
  ribbon?: boolean
  ribbonPlacement?: 'up' | 'down'
  dotPlacement?: 'up' | 'down'
  shape?: AvatarLoaderShapeModifier
}

const AvatarBody = ({
  src,
  size,
  stubIconName,
  haveSource,
  setHaveSource
}: {
  src?: string
  size: SizeModifier
  stubIconName: AppIconName
  haveSource: boolean
  setHaveSource: (v: boolean) => void
}) => {
  const iconSize = size === 'medium' || size === 'small' ? 'small' : size

  return !haveSource ? (
    <div className="app-avatar__image">
      <AppIcon name={stubIconName} size={iconSize} />
    </div>
  ) : (
    <Image
      src="https://i.pravatar.cc/150?img=66"
      className="app-avatar__image"
      alt="avatar"
      onError={() => setHaveSource(false)}
    />
    // <Image src={src} className="app-avatar__image" alt="avatar" onError={() => setHaveSource(false)} />
  )
}

const BadgeWrapper = ({
  children,
  online,
  ribbon,
  ribbonPlacement
}: {
  children: React.ReactNode
  online?: boolean
  ribbon?: boolean
  ribbonPlacement: 'up' | 'down'
}) =>
  ribbon ? (
    <Badge.Ribbon text="G" placement={ribbonPlacement === 'up' ? 'start' : 'end'}>
      {children}
    </Badge.Ribbon>
  ) : (
    <Badge dot color={online ? 'green' : 'red'}>
      {children}
    </Badge>
  )

export const AppAvatar = ({
  online,
  src,
  size = 'small',
  showBadge = true,
  stubIconName = 'user-stub',
  ribbon = false,
  ribbonPlacement = 'up',
  dotPlacement = 'up',
  shape = 'circle-shape'
}: AvatarProps) => {
  const [haveSource, setHaveSource] = useState(Boolean(src))

  useEffect(() => {
    setHaveSource(Boolean(src))
  }, [src])

  const body = (
    <AvatarBody
      src={src}
      size={size}
      stubIconName={stubIconName}
      haveSource={haveSource}
      setHaveSource={setHaveSource}
    />
  )

  return (
    <div
      className={`app-avatar app-avatar--${size} app-avatar--${shape} app-avatar--ribbon-${ribbonPlacement} app-avatar--dot-${dotPlacement}`}
    >
      {showBadge ? (
        <BadgeWrapper online={online} ribbon={ribbon} ribbonPlacement={ribbonPlacement}>
          {body}
        </BadgeWrapper>
      ) : (
        body
      )}
    </div>
  )
}
