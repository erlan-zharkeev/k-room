import './style.scss'
import { IEventGetUserTypingStatus, SocketActionsType } from 'common-types'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { clientConstants } from 'src/client-constants'
import { useTypedSelector } from 'src/shared/lib'
import { socket } from 'src/shared/api'
import { AppDispatch } from 'src/app/store'
import { AppButton } from 'src/shared/ui'
import { getChatName } from 'src/shared/utils'
import { showModal } from 'src/entities/system'
import { useSettings } from 'src/entities/settings'
import { ChatRoomAvatar } from 'src/entities/chat-room'

export const RoomHeader = () => {
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const { selectedChatRoomId } = useTypedSelector((state) => state.persist.settings)
  const chatRoomData = chatRooms.find((room) => room.id === selectedChatRoomId)
  const [typingDotsQuantity, setTypingDotsQuantity] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [typingAuthors, setTypingAuthors] = useState<{ authorId: string; authorName: string }[]>([])
  const { updateSetting } = useSettings()

  useEffect(() => {
    setTimeout(() => {
      setTypingDotsQuantity((typingDotsQuantity) => {
        return typingDotsQuantity < 3 ? typingDotsQuantity + 1 : 0
      })
    }, 1500)
  }, [isTyping])

  const dispatch = useDispatch<AppDispatch>()

  socket.on<SocketActionsType>('get-user-typing-status', ({ authorData, status }: IEventGetUserTypingStatus) => {
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
  })

  const openChatMembers = () => {
    dispatch(
      showModal({
        title: 'Group Chat Info',
        modalContentComponentName: 'chat-room-settings-popup'
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
    updateSetting('selectedChatRoomId', { selectChatRoomId: '' })
  }

  return (
    <div className="room-header" style={{ height: clientConstants.dimensions.roomHeader }}>
      <div className="room-header__back-button">
        <AppButton prefixIconName="arrow-left" onClick={resetChatRoom} />
      </div>
      <div className="room-header__info">
        {chatRoomData && <ChatRoomAvatar room={chatRoomData} />}
        {chatRoomData?.multiple ? (
          <AppButton additionalClassName="room-header__name" text={chatRoomData?.chatName} onClick={openChatMembers} />
        ) : (
          <h3 className="room-header__name">{getChatName(chatRoomData)}</h3>
        )}
        {isTyping && <div className="is-typing blink-me paragraph-text paragraph-text--accent">{whoIsTyping()}</div>}
      </div>
    </div>
  )
}
