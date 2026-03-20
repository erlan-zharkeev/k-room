import './style.scss'

import { ReactNode } from 'react'

import { UnknownCallback } from 'common-types'

import { AppAvatar, AppIconName, AppText, AvatarShapeModifier, BaseSizeModifier } from 'src/shared/ui'
import { createClassNameWithModifiers } from 'src/shared/utils'

import { ProfileInfoAvatarSizeType } from './types'

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
      <div
        className={`profile-info__credential${onClick ? ' profile-info__credential--pointer' : ''}`}
        onClick={onClick}
      >
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
