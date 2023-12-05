import { SocketActions, SocketActionsPayload, UserSettingKey } from 'common-types'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { UIButton, UIAvatar } from 'src/components'
import { clientConstants } from 'src/client-constants'
import { useTypedSelector, useUpdateSettings } from 'src/hooks'
import { $socket } from 'src/services'
import { AppDispatch, showModal } from 'src/store'
import { ModalContentComponentName, UIAvatarBadgePlacement } from 'src/@types'

export const RoomHeader = () => {
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const { selectedChatRoomId } = useTypedSelector((state) => state.persist.settings)
  const chatRoomData = chatRooms.find((room) => room.id === selectedChatRoomId)
  const [typingDotsQuantity, setTypingDotsQuantity] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [typingAuthors, setTypingAuthors] = useState([] as Array<{ authorId: string; authorName: string }>)
  const { updateSetting } = useUpdateSettings()

  useEffect(() => {
    setTimeout(() => {
      setTypingDotsQuantity((typingDotsQuantity) => {
        return typingDotsQuantity < 3 ? typingDotsQuantity + 1 : 0
      })
    }, clientConstants.commonTimeoutDuration)
  }, [isTyping])

  const dispatch = useDispatch<AppDispatch>()

  $socket.on(
    SocketActions.GET_USER_TYPING_STATUS,
    ({ authorData, status }: SocketActionsPayload['getUserTypingStatus']) => {
      if (!chatRoomData) return
      setIsTyping(status)
      let newArrayOfTypingAuthors = [...typingAuthors]
      if (status) {
        const authorCandidate = newArrayOfTypingAuthors.find((author) => author.authorId === authorData.authorId)
        if (!authorCandidate) newArrayOfTypingAuthors.push(authorData)
      } else {
        newArrayOfTypingAuthors = newArrayOfTypingAuthors.filter((author) => author.authorId === authorData.authorId)
      }
      setTypingAuthors(newArrayOfTypingAuthors)
    }
  )

  const openChatMembers = () => {
    dispatch(
      showModal({
        title: 'Group Chat Info',
        modalContentComponentName: ModalContentComponentName.chatRoomSettingsPopup
      })
    )
  }

  const whoIsTyping = () => {
    if (chatRoomData?.multiple) {
      return `${typingAuthors.map((author) => author.authorName).join(', ')} ${
        typingAuthors.length > 1 ? 'are typing' : 'is typing'
      }`
    }
    return ` Typing ${Array.from('.'.repeat(typingDotsQuantity)).join(' ')}`
  }

  const resetChatRoom = () => {
    updateSetting(UserSettingKey.selectedChatRoomId, { selectChatRoomId: '' })
  }

  return (
    <div className="room-header" style={{ height: clientConstants.dimensions.roomHeader }}>
      <div className="room-header__back-button">
        <UIButton iconName="arrow-left" onClick={resetChatRoom} />
      </div>
      <div className="room-header__info">
        <UIAvatar
          ribbon={chatRoomData?.multiple}
          ribbonPlacement={UIAvatarBadgePlacement.down}
          dotPlacement={UIAvatarBadgePlacement.down}
          stubIconName={chatRoomData?.multiple ? 'image-stub' : 'user-stub'}
          online={chatRoomData?.hasOnline}
          src={chatRoomData?.avatarPath}
          shape={chatRoomData?.multiple ? 'square' : 'round'}
        />
        {chatRoomData?.multiple ? (
          <UIButton className="room-header__name" text={chatRoomData?.chatName} onClick={openChatMembers} />
        ) : (
          <h3 className="room-header__name">{chatRoomData?.chatName}</h3>
        )}
        {isTyping && <div className="is-typing blink-me paragraph-text paragraph-text--accent">{whoIsTyping()}</div>}
      </div>
    </div>
  )
}
