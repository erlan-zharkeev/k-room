import { SocketActions } from 'common-types'
import { useState, useEffect } from 'react'
import { socket } from 'src/socket/socket'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { AppDispatch } from 'src/store'
import { selectChatRoom } from 'src/store/settingsSlice'
import UIAvatar from 'ui/UIAvatar'
import UIButton from 'ui/UIButton'
import constants from 'src/constants'

export const RoomHeader = () => {
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const { selectedChatRoomId } = useTypedSelector((state) => state.persist.settings)
  const chatRoomData = chatRooms.find((room) => room.roomId === selectedChatRoomId)
  const [typingDotsQuantity, setTypingDotsQuantity] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    setInterval(() => {
      setTypingDotsQuantity((typingDotsQuantity) => {
        return typingDotsQuantity < 3 ? typingDotsQuantity + 1 : 0
      })
    }, 1000)
  }, [isTyping])

  const dispatch = useDispatch<AppDispatch>()

  socket.on(SocketActions.GET_USER_TYPING_STATUS, (data: { userIdFrom: string; status: boolean }) => {
    const hasTypingInterlocutor = chatRoomData.users.find((user) => user.id === data.userIdFrom)
    if (hasTypingInterlocutor) setIsTyping(data.status)
  })

  function deselectChat() {
    dispatch(selectChatRoom(''))
  }

  return (
    <div className="room-header" style={{ height: constants.roomHeader }}>
      <div className="room-header__back-button">
        <UIButton iconName="arrow-left" onClick={deselectChat} />
      </div>

      <div className="room-header__info">
        <UIAvatar online={chatRoomData?.hasOnline} src={chatRoomData?.avatar} />
        <h3 className="room-header__name">{chatRoomData?.chatName}</h3>
        {isTyping && (
          <div className="is-typing blink-me paragraph-text paragraph-text--accent">
            Typing {Array.from('.'.repeat(typingDotsQuantity)).join(' ')}
          </div>
        )}
      </div>
      <div className="room-header__controls">
        {/* <Button
          size="large"
          className="borderless"
          type="text"
          icon={<PhoneOutlined />}
          onClick={() => dispatch(initCall())}
        /> */}
        {/* <Dropdown
          overlay={
            <Menu
              items={[
                { key: '1', label: 'setting1' },
                { key: '2', label: 'setting2' }
              ]}
            ></Menu>
          }
          placement="topLeft"
        >
          <Button className="borderless" shape="circle" type="text" icon={<SettingOutlined />} size="large"></Button>
        </Dropdown> */}
      </div>
    </div>
  )
}
export default RoomHeader
