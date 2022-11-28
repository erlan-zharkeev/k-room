import { List, Badge, Avatar, Button, Tooltip, Image } from 'antd'
import useTypedSelector from '../../../../hooks/useTypedSelector'
import ContactSearch from './Components/ContactSearch/ContactSearch'
import { UserOutlined, MessageOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { User, SocketActions } from 'k-room.types'
import { ReactElement, useState } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../../store'
import { changeAsideTab } from '../../../../store/systemSlice'
import { setChatRoom } from '../../../../store/chatRoomsSlice'
import { socket } from './../../../../socket/socket'

const ContactList = () => {
  const { contacts } = useTypedSelector((state) => state.persist.contacts)
  const { chatRooms } = useTypedSelector((state) => state.persist.chatRooms)
  const { id, username } = useTypedSelector((state) => state.persist.auth.userData)
  const { showTooltips } = useTypedSelector((state) => state.persist.system)
  const [roomCreateLoader, setRoomCreateLoader] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  const createUser = (id: string, username: string) => {
    return {
      id,
      username: username ?? ''
    }
  }

  const deleteUser = (userData: User) => {
    if (userData.id && id) socket.emit(SocketActions.DELETE_CONTACT, { currentUserId: id, deletingUserId: userData.id })
  }

  const createChat = (value: User) => {
    const hasChatWithContact = chatRooms.some((room) => {
      if (room.multiple) return
      const user = room.users.find((user) => user.id === value.id)
      if (user.id) {
        dispatch(changeAsideTab('chatList'))
        dispatch(setChatRoom(room.roomId))
      }
      return Boolean(user)
    })
    if (hasChatWithContact) return
    const contactId = value.id
    const contactName = value.username

    const hasUsersData = contactId && contactName && id && username
    if (!hasUsersData) return
    const users = [createUser(id, username), createUser(contactId, contactName)]

    setRoomCreateLoader(true)
    socket.emit(SocketActions.CREATE_ROOM, { users, authorId: id })

    socket.on(SocketActions.ROOM_CREATED, () => {
      setRoomCreateLoader(false)
      dispatch(changeAsideTab('chatList'))
    })
  }

  const CustomButton = (clickEvent: (value: User) => void, icon: ReactElement, clickEventPayload: any) => (
    <Button icon={icon} onClick={() => clickEvent(clickEventPayload)} size="large" className="borderless" type="text" />
  )

  const ButtonWrapper = (
    clickEvent: (value: User) => void,
    icon: ReactElement,
    clickEventPayload: User,
    title: string
  ) => {
    return showTooltips ? (
      <Tooltip placement="topLeft" title={title}>
        {CustomButton(clickEvent, icon, clickEventPayload)}
      </Tooltip>
    ) : (
      <>{CustomButton(clickEvent, icon, clickEventPayload)}</>
    )
  }

  const lastSeen = (timeStamp: string | undefined) => {
    return timeStamp ? `last seen ${moment(Number(timeStamp)).startOf('minutes').fromNow()}` : ''
  }

  return (
    <div className="contact-list">
      <ContactSearch />
      <List
        header={<div>Contacts</div>}
        itemLayout="horizontal"
        dataSource={contacts}
        locale={{
          emptyText: <div className="paragraph-text paragraph-text--secondary">There are no contacts yet</div>
        }}
        renderItem={(user: any) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Badge dot={user.online} color="green">
                  {user.avatar ? <Image src={user.avatar} className="custom-avatar" /> : <UserOutlined />}
                </Badge>
              }
              title={<span>{user.username}</span>}
              description={
                <span className="paragraph-text paragraph-text--secondary">
                  {user.online ? 'online' : lastSeen(user.lastSeen)}
                </span>
              }
            />
            {ButtonWrapper(createChat, roomCreateLoader ? <LoadingOutlined /> : <MessageOutlined />, user, 'Open chat')}
            {ButtonWrapper(deleteUser, <CloseCircleOutlined />, user, 'Delete contact')}
          </List.Item>
        )}
      />
    </div>
  )
}

export default ContactList
