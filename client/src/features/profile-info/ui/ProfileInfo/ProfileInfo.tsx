import './style.scss'

import { ReactNode } from 'react'

import { UnknownCallback } from 'common-types'

import { AppAvatar, AppIconName, AppText, AvatarShapeModifier, BaseSizeModifier } from 'src/shared/ui'

export const ProfileInfo = ({
  avatarPath,
  title,
  description,
  online,
  showBadge = true,
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
  avatarPath?: string
  title: string
  description?: string
  online?: boolean
  showBadge?: boolean
  horizontal?: boolean
  avatarSize?: 'small' | 'large'
  shape?: AvatarShapeModifier
  stubIconName?: AppIconName
  onClick?: UnknownCallback
  titleSize?: BaseSizeModifier
  children?: ReactNode
  isDescriptionAccent?: boolean
  descriptionNode?: ReactNode
}) => {
  return (
    <div className={`profile-info${horizontal ? ' profile-info--horizontal' : ''}`}>
      <AppAvatar
        online={online}
        src={avatarPath}
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
          <AppText tag="p" size="small" accent={isDescriptionAccent}>
            {description}
          </AppText>
        )}
        {descriptionNode && descriptionNode}
      </div>
      {children}
    </div>
  )
}
