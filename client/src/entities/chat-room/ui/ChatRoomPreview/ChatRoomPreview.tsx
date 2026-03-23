import './style.scss'

import { useEffect, useState } from 'react'

import { UnknownCallback } from 'common-types'

import { useContact } from 'src/entities/contact'
import { useMedia } from 'src/entities/media'
import { useMessage } from 'src/entities/message'
import { ProfileInfo } from 'src/entities/profile-info'

import { FChatRoomType } from 'src/shared/config'
import { BaseSizeModifier } from 'src/shared/ui'
import { createClassNameWithModifiers } from 'src/shared/utils'

import { isRoomPrivate } from '../../lib'

export const ChatRoomPreview = ({
  room,
  onClick,
  headerMode = false,
  titleSize,
  isRoomSelected
}: {
  room: FChatRoomType
  onClick?: UnknownCallback
  headerMode?: boolean
  titleSize?: BaseSizeModifier
  isRoomSelected?: boolean
}) => {
  const { getLiveMedia } = useMedia()
  const { contacts } = useContact()
  const { getMessageById } = useMessage()
  const isPrivate = isRoomPrivate(room)

  const chatRoomAvatarShape = isPrivate ? 'circle-shape' : 'square-shape'
  const chatRoomStubIcon = isPrivate ? 'user-stub' : 'image-stub'
  const onClickHandler = isPrivate ? undefined : onClick

  const className = createClassNameWithModifiers({
    rootClass: 'chat-room-preview',
    modifiers: [headerMode && 'header-mode', isRoomSelected && 'selected']
  })

  const avatarPath = getLiveMedia(room.avatarId)
  const privateRoomContact = isPrivate ? contacts.find((contact) => contact.id === room.users[0]) : undefined
  const lastMessageBody = room.lastMessageId ? getMessageById(room.lastMessageId)?.body ?? '' : ''

  const [chatName, setChatName] = useState(room.chatName ?? '')

  useEffect(() => {
    if (!room.chatName) {
      const contactData = contacts.find((contact) => contact.id === room.users[0])
      if (contactData) {
        setChatName(contactData.username)
      }
    }
  }, [room, contacts])

  return (
    <div className={className}>
      <ProfileInfo
        titleSize={titleSize}
        avatar={avatarPath}
        title={chatName}
        description={!headerMode ? lastMessageBody : ''}
        online={privateRoomContact?.online}
        shape={chatRoomAvatarShape}
        stubIconName={chatRoomStubIcon}
        showBadge={isPrivate}
        onClick={onClickHandler}
      />
    </div>
  )
}
