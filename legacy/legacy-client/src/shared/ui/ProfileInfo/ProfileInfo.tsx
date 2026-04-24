import './style.scss'

import { ReactNode } from 'react'

import { UnknownCallbackType } from 'common'

import { createClassNameWithModifiers } from 'src/shared/lib'

import { AppAvatar } from '../AppAvatar/AppAvatar'
import { AppIconNameType } from '../AppIcon/internals/types'
import { AppText } from '../AppText/AppText'
import { AvatarShapeModifierType, BaseSizeModifierType } from '../internals/types'

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
  shape?: AvatarShapeModifierType
  stubIconName?: AppIconNameType
  onClick?: UnknownCallbackType
  titleSize?: BaseSizeModifierType
  children?: ReactNode
  isDescriptionAccent?: boolean
  descriptionNode?: ReactNode
}) => {
  const className = createClassNameWithModifiers({ rootClass: 'profile-info', modifiers: [horizontal && 'horizontal'] })
  const credentialClassName = createClassNameWithModifiers({
    rootClass: 'profile-info__credential',
    modifiers: [onClick && 'pointer']
  })
  const credentials = (
    <>
      <AppText tag="p" size={titleSize}>
        {title}
      </AppText>
      {description && (
        <AppText tag="p" size="small" color={isDescriptionAccent ? 'accent-color' : undefined}>
          {description}
        </AppText>
      )}
      {descriptionNode && descriptionNode}
    </>
  )

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
      {onClick ? (
        <button type="button" className={credentialClassName} onClick={onClick}>
          {credentials}
        </button>
      ) : (
        <div className={credentialClassName}>{credentials}</div>
      )}
      {children}
    </div>
  )
}
