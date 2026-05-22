import { UnknownCallback } from 'common'

import { createClassNameWithModifiers } from 'src/shared/lib'
import { BaseSizeModifier, ProfileInfo } from 'src/shared/ui'

export const ChatRoomPreview = ({
  avatar,
  title,
  description,
  online,
  onClick,
  headerMode = false,
  titleSize,
  isPrivate = false,
  isRoomSelected = false
}: {
  avatar?: string
  title: string
  description?: string
  online?: boolean
  onClick?: UnknownCallback
  headerMode?: boolean
  titleSize?: BaseSizeModifier
  isPrivate?: boolean
  isRoomSelected?: boolean
}) => {
  const className = createClassNameWithModifiers({
    rootClass: 'chat-room-preview',
    modifiers: [headerMode && 'header-mode', isRoomSelected && 'selected']
  })

  return (
    <div className={className}>
      <ProfileInfo
        titleSize={titleSize}
        avatar={avatar}
        title={title}
        description={!headerMode ? description : ''}
        online={online}
        shape={isPrivate ? 'circle-shape' : 'square-shape'}
        stubIconName={isPrivate ? 'user-stub' : 'image-stub'}
        showBadge={isPrivate}
        onClick={isPrivate ? undefined : onClick}
      />
    </div>
  )
}
