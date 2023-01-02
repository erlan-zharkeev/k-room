import { List, Image, Badge, Tooltip, Button, Avatar } from 'antd'
import { PlusOutlined, UserOutlined } from '@ant-design/icons'
import { SocketActions, ChatRoom, Message } from 'common-types'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { socket } from 'src/socket/socket'
import { AppDispatch } from 'src/store'
import { deselectChatRoom, selectChatRoom } from 'src/store/systemSlice'

export const ChatRoomList = () => {
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const { selectedChatRoomId } = useTypedSelector((state) => state.persist.system)
  const { contacts } = useTypedSelector((state) => state.contacts)
  const { id } = useTypedSelector((state) => state.auth.userData)
  const { showTooltips } = useTypedSelector((state) => state.persist.system)

  const dispatch = useDispatch<AppDispatch>()

  const getLastMessage = (messages: Array<Message>): string => {
    if (!messages) return ''
    return messages[messages.length - 1]?.body ?? ''
  }

  const setChat = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
    e.stopPropagation()
    dispatch(selectChatRoom(id))
  }

  const addUser = async (e: React.MouseEvent<HTMLElement, MouseEvent>, interlocutorId: string) => {
    e.stopPropagation()
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
        <Button size="small" icon={<PlusOutlined />} onClick={async (e) => await addUser(e, user.id)} />
      </Tooltip>
    ) : (
      <Button size="small" icon={<PlusOutlined />} onClick={async (e) => await addUser(e, user.id)} />
    )
  }

  const UnreadMessagesWrapper = (chatRoom: ChatRoom) => {
    return unreadMessages(chatRoom) ? (
      <Button type="primary" shape="default" size="small" className="chat-room-list__unread-messages">
        {unreadMessages(chatRoom)} unread message{unreadMessages(chatRoom) > 1 && 's'}
      </Button>
    ) : (
      <></>
    )
  }

  return (
    <div className="chat-room-list" onClick={() => dispatch(deselectChatRoom())}>
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
                    {chatRoom.avatar ? (
                      <Image src={chatRoom.avatar} className="custom-avatar" />
                    ) : (
                      <Avatar size="small" src={chatRoom.avatar} icon={<UserOutlined />} />
                    )}
                  </Badge>
                }
                title={<span>{chatRoom.chatName}</span>}
                description={getLastMessage(chatRoom.messages)}
              />
              <div className="chat-room-list__controls">
                {AddUserButtonWrapper(chatRoom)}
                {UnreadMessagesWrapper(chatRoom)}
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  )
}

export default ChatRoomList
