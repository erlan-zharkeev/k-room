import { Image, Badge, Button, Avatar } from 'antd'
import { UserOutlined, PhoneOutlined } from '@ant-design/icons'
import { SocketActions } from 'common-types'
import { useState, useEffect } from 'react'
import { socket } from 'src/socket/socket'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { AppDispatch } from 'src/store'
import { selectChatRoom } from 'src/store/settingsSlice'

export const RoomHeader = () => {
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const { selectedChatRoomId } = useTypedSelector((state) => state.persist.settings)
  const chatRoomData = chatRooms.find((room) => room.roomId === selectedChatRoomId)
  const [typingDotsQuantity, setTypingDotsQuantity] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const dotsCounter = setInterval(() => {
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

  return (
    <div className="room-header">
      <Button
        className="borderless room-header__back-button"
        type="primary"
        onClick={() => dispatch(selectChatRoom(''))}
      >
        Back
      </Button>
      <div className="room-header__info">
        <Badge dot={chatRoomData?.hasOnline} color="green">
          {chatRoomData?.avatar ? (
            <Image src={chatRoomData?.avatar} className="custom-avatar" alt="avatar" />
          ) : (
            <Avatar size="small" src={chatRoomData.avatar} icon={<UserOutlined />} alt="avatar" />
          )}
        </Badge>
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
