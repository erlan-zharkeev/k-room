import { List, Image, Badge, Tooltip, Button } from 'antd'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../../store'
import { removeSelectedChat, setChatRoom } from '../../../../store/chatRoomsSlice'
import getLastMessage from '../../../../utils/getLastMessage'
import { UserOutlined } from '@ant-design/icons'
import { ChatRoom, SocketActions } from './../../../../../../types'
import { PlusOutlined } from '@ant-design/icons'
import { socket } from '../../../../socket/socket'

export const ChatRoomList = () => {
  const { chatRooms, selectedChatRoomId } = useTypedSelector((state) => state.persist.chatRooms)
  const { contacts } = useTypedSelector((state) => state.persist.contacts)
  const { id } = useTypedSelector((state) => state.persist.auth.userData)
  const { showTooltips } = useTypedSelector((state) => state.persist.system)

  const dispatch = useDispatch<AppDispatch>()

  const setChat = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
    e.stopPropagation()
    dispatch(setChatRoom(id))
  }

  const addUser = async (interlocutorId: string) => {
    socket.emit(SocketActions.SAVE_CONTACT, { userId: id, interlocutorId })
  }

  const unreadMessages = (room: ChatRoom) =>
    room.messages.filter((message) => !message.isSelf && message.status === 'delivered').length

  const AddUserButtonWrapper = (chatRoom: ChatRoom) => {
    if (chatRoom.multiple) return
    if (chatRoom.users.length !== 1) return
    const user = chatRoom.users[0]
    const hasUserInContacts = !!contacts.find((element: any) => element.id === user.id)
    if (hasUserInContacts) return
    return showTooltips ? (
      <Tooltip placement="topLeft" title="Add to contact">
        <Button size="small" icon={<PlusOutlined />} onClick={() => addUser(user.id)} />
      </Tooltip>
    ) : (
      <Button size="small" icon={<PlusOutlined />} onClick={() => addUser(user.id)} />
    )
  }

  return (
    <div className="chat-room-list" onClick={() => dispatch(removeSelectedChat())}>
      <div className="chat-room-list__body">
        <List
          itemLayout="horizontal"
          dataSource={chatRooms}
          locale={{
            emptyText: <div className="paragraph-text paragraph-text--secondary">There are no chats yet</div>
          }}
          renderItem={(chatRoom: any) => (
            <List.Item
              onClick={(e: any) => setChat(e, chatRoom.roomId)}
              key={chatRoom.roomId}
              className={selectedChatRoomId === chatRoom.roomId ? 'active' : ''}
            >
              <List.Item.Meta
                avatar={
                  <Badge dot={chatRoom.hasOnline} color="green">
                    {chatRoom.avatar ? <Image src={chatRoom.avatar} className="custom-avatar" /> : <UserOutlined />}
                    {/* <Avatar src={chatRoom.avatar} icon={<UserOutlined />} /> */}
                  </Badge>
                }
                title={<span>{chatRoom.chatName}</span>}
                description={getLastMessage(chatRoom.messages)}
              />
              {AddUserButtonWrapper(chatRoom)}
              {unreadMessages(chatRoom) ? (
                <Button type="primary" shape="circle">
                  {unreadMessages(chatRoom)}
                </Button>
              ) : (
                <></>
              )}
            </List.Item>
          )}
        />
      </div>
    </div>
  )
}

export default ChatRoomList
