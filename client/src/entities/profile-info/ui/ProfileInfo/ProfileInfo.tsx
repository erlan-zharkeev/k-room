import './style.scss'

import { ReactNode } from 'react'

import { UnknownCallback } from 'common-types'

import type { ProfileInfoAvatarSizeType } from 'src/entities/profile-info'

import type { AppIconName, AvatarShapeModifier, BaseSizeModifier } from 'src/shared/ui'
import { AppAvatar, AppText } from 'src/shared/ui'
import { createClassNameWithModifiers } from 'src/shared/utils'

export const ProfileInfo = ({
  avatar,
  title,
  description,
  online,
  showBadge = false,
  horizontal = false,
  avatarSize = 'small',
  shape,
  stubIconName,
  onClick,
  titleSize,
  children,
  isDescriptionAccent,
  descriptionNode
}: {
  avatar?: string
  title: string
  description?: string
  online?: boolean
  showBadge?: boolean
  horizontal?: boolean
  avatarSize?: ProfileInfoAvatarSizeType
  shape?: AvatarShapeModifier
  stubIconName?: AppIconName
  onClick?: UnknownCallback
  titleSize?: BaseSizeModifier
  children?: ReactNode
  isDescriptionAccent?: boolean
  descriptionNode?: ReactNode
}) => {
  const className = createClassNameWithModifiers({ rootClass: 'profile-info', modifiers: [horizontal && 'horizontal'] })
  const credentialClassName = createClassNameWithModifiers({
    rootClass: 'profile-info__credential',
    modifiers: [onClick && 'pointer']
  })

  return (
    <div className={className}>
      <AppAvatar
        online={online}
        src={avatar}
        showBadge={showBadge}
        size={avatarSize}
        shape={shape}
        stubIconName={stubIconName}
      />
      <div className={credentialClassName} onClick={onClick}>
        <AppText tag="p" size={titleSize}>
          {title}
        </AppText>
        {description && (
          <AppText tag="p" size="small" color={isDescriptionAccent ? 'accent-color' : undefined}>
            {description}
          </AppText>
        )}
        {descriptionNode && descriptionNode}
      </div>
      {children}
    </div>
  )
}
