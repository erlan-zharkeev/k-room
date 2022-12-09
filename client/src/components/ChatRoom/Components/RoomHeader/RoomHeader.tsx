import { Image, Badge, Button, Dropdown, Menu, Avatar } from 'antd'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../../store'
import { setChatRoom } from '../../../../store/chatRoomsSlice'
import { UserOutlined, SettingOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { socket } from '../../../../socket/socket'
import { SocketActions } from './../../../../../../types'

export const RoomHeader = () => {
  const { selectedChatRoomId, chatRooms } = useTypedSelector((state) => state.chatRooms)
  const chatRoomData = chatRooms.find((room: any) => room.roomId === selectedChatRoomId)
  const [typingDotsQuantity, setTypingDotsQuantity] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    let dotsCounter = setInterval(() => {
      setTypingDotsQuantity((typingDotsQuantity) => {
        return typingDotsQuantity < 3 ? typingDotsQuantity + 1 : 0
      })
    }, 1000)
    // if (!isTyping) dotsCounter = null
  }, [isTyping])

  const dispatch = useDispatch<AppDispatch>()

  socket.on(SocketActions.GET_USER_TYPING_STATUS, (data: { userIdFrom: string; status: boolean }) => {
    const hasTypingInterlocutor = chatRoomData.users.find((user) => user.id === data.userIdFrom)
    if (hasTypingInterlocutor) setIsTyping(data.status)
  })

  return (
    <div className="room-header">
      <Button className="borderless room-header__back-button" type="primary" onClick={() => dispatch(setChatRoom(''))}>
        Back
      </Button>
      <div className="room-header__info">
        <Badge dot={chatRoomData?.hasOnline} color="green">
          {chatRoomData?.avatar ? (
            <Image src={chatRoomData?.avatar} className="custom-avatar" />
          ) : (
            <Avatar size="small" src={chatRoomData.avatar} icon={<UserOutlined />} />
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
