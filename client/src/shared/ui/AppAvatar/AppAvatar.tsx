import './style.scss'
import { useState, useEffect } from 'react'

import { Badge, Image } from 'antd'

import { AppIconName, AppIcon } from 'src/shared/ui'
import { createClassNameWithModifiers } from 'src/shared/utils'

import type { IAppAvatarProps } from './types'

const AvatarBody = ({
  src,
  stubIconName,
  haveSource,
  setHaveSource,
  preview = true
}: {
  src?: string
  stubIconName: AppIconName
  haveSource: boolean
  setHaveSource: (v: boolean) => void
  preview?: boolean
}) => {
  return !haveSource ? (
    <div className="app-avatar__image">
      <AppIcon name={stubIconName} size="fill" />
    </div>
  ) : (
    <Image
      src={src}
      preview={preview}
      className="app-avatar__image"
      alt="avatar"
      onError={() => setHaveSource(false)}
    />
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
    <Badge dot={online !== undefined} color={online ? 'green' : 'red'}>
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
  shape = 'circle-shape',
  preview = true,
  borderless = false
}: IAppAvatarProps) => {
  const [haveSource, setHaveSource] = useState(Boolean(src))

  useEffect(() => {
    setHaveSource(Boolean(src))
  }, [src])

  const body = (
    <AvatarBody
      src={src}
      preview={preview}
      stubIconName={stubIconName}
      haveSource={haveSource}
      setHaveSource={setHaveSource}
    />
  )

  const classNames = createClassNameWithModifiers({
    rootClass: 'app-avatar',
    modifiers: [size, shape, `ribbon-${ribbonPlacement}`, `dot-${dotPlacement}`, borderless && 'borderless']
  })

  return (
    <div className={classNames}>
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
