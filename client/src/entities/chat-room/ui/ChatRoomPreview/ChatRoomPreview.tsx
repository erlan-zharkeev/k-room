import './style.scss'
import { IChatRoom, UnknownCallback } from 'common-types'

import { ProfileInfo } from 'src/entities/profile-info'

import { BaseSizeModifier } from 'src/shared/ui'
import { chatRoomLastMessageBody, createClassNameWithModifiers } from 'src/shared/utils'

export const ChatRoomPreview = ({
  room,
  onClick,
  headerMode = false,
  titleSize,
  isRoomSelected
}: {
  room: IChatRoom
  onClick?: UnknownCallback
  headerMode?: boolean
  titleSize?: BaseSizeModifier
  isRoomSelected?: boolean
}) => {
  const isPrivate = room.users.length === 1

  const chatRoomAvatarShape = isPrivate ? 'circle-shape' : 'square-shape'
  const chatRoomStubIcon = isPrivate ? 'user-stub' : 'image-stub'
  const onClickHandler = isPrivate ? undefined : onClick

  const className = createClassNameWithModifiers({
    rootClass: 'chat-room-preview',
    modifiers: [headerMode && 'header-mode', isRoomSelected && 'selected']
  })

  return (
    <div className={className}>
      <ProfileInfo
        titleSize={titleSize}
        avatarPath={room.avatarPath}
        title={room.chatName ?? '-'}
        description={!headerMode ? chatRoomLastMessageBody(room) : ''}
        shape={chatRoomAvatarShape}
        stubIconName={chatRoomStubIcon}
        showBadge={isPrivate}
        onClick={onClickHandler}
      />
    </div>
  )
}
