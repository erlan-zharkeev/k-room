import { SocketActions } from 'common-types'
import { useState, useEffect } from 'react'
import { socket } from 'src/socket/socket'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { AppDispatch } from 'src/store'
import { selectChatRoom } from 'src/store/settingsSlice'

import constants from 'src/constants'
import { showModal } from 'src/store/systemSlice'
import { UIButton, UIAvatar } from 'src/components/UI'

const RoomHeader = () => {
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const { selectedChatRoomId } = useTypedSelector((state) => state.persist.settings)
  const chatRoomData = chatRooms.find((room) => room.id === selectedChatRoomId)
  const [typingDotsQuantity, setTypingDotsQuantity] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setTypingDotsQuantity((typingDotsQuantity) => {
        return typingDotsQuantity < 3 ? typingDotsQuantity + 1 : 0
      })
    }, 1000)
  }, [isTyping])

  const dispatch = useDispatch<AppDispatch>()

  socket.on(SocketActions['get-user-typing-status'], (data: { userIdFrom: string; status: boolean }) => {
    if (!chatRoomData) return
    const hasTypingInterlocutor = chatRoomData?.users?.find((user) => user.id === data.userIdFrom)
    if (hasTypingInterlocutor) setIsTyping(data.status)
  })

  const openChatMembers = () => {
    dispatch(showModal({ title: 'Group Chat Info', modalContentComponentName: 'ChatRoomSettingsPopup' }))
  }

  return (
    <div className="room-header" style={{ height: constants.dimensions.roomHeader }}>
      <div className="room-header__back-button">
        <UIButton iconName="arrow-left" onClick={() => dispatch(selectChatRoom(''))} />
      </div>
      <div className="room-header__info">
        <UIAvatar
          ribbon={chatRoomData?.multiple}
          stubIconName={chatRoomData?.multiple ? 'image-stub' : 'user-stub'}
          online={chatRoomData?.hasOnline}
          src={chatRoomData?.avatarPath}
          shape={chatRoomData?.multiple ? 'square' : 'round'}
        />
        <h3 onClick={openChatMembers} className={`room-header__name ${chatRoomData?.multiple && 'pointer'}`}>
          {chatRoomData?.chatName}
        </h3>
        {isTyping && (
          <div className="is-typing blink-me paragraph-text paragraph-text--accent">
            Typing {Array.from('.'.repeat(typingDotsQuantity)).join(' ')}
          </div>
        )}
      </div>
    </div>
  )
}

export default RoomHeader
