import { List, Badge, Avatar, Image, Button, Tooltip } from 'antd'
import {
  UserOutlined,
  MessageOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  PhoneOutlined,
  VideoCameraOutlined
} from '@ant-design/icons'
import { User, SocketActions } from 'common-types'
import moment from 'moment'
import { ReactElement, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { socket } from 'src/socket/socket'
import { AppDispatch } from 'src/store'
import ContactSearch from './Components/ContactSearch/ContactSearch'
import { changeAsideTab, selectChatRoom } from 'src/store/settingsSlice'
import { initModalToCall, setCurrentCallAccepted } from 'src/store/callsSlice'
import call from 'src/call/call'

const ContactList = () => {
  const { contacts } = useTypedSelector((state) => state.contacts)
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const { id, username, avatar } = useTypedSelector((state) => state.user.userData)
  const [roomCreateLoader, setRoomCreateLoader] = useState(false)
  const { settings } = useTypedSelector((state) => state.persist)
  const [isStreamIsLoading, setIsStreamIsLoading] = useState(false)

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
        dispatch(selectChatRoom(room.roomId))
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
    clickEvent: (value: any) => void,
    icon: ReactElement,
    clickEventPayload: User,
    title: string
  ) => {
    return settings.showTooltips ? (
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

  const initCall = async (interlocutorData: User) => {
    setIsStreamIsLoading(true)
    const gotStream = await call.setStream()
    setIsStreamIsLoading(false)
    if (gotStream) call.initCall(interlocutorData, id, avatar, username)
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
        renderItem={(user) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Badge dot={user.online} color="green">
                  {user.avatar ? (
                    <Image src={user.avatar} className="custom-avatar" />
                  ) : (
                    <Avatar size="small" src={user.avatar} icon={<UserOutlined />} />
                  )}
                </Badge>
              }
              title={<span>{user.username}</span>}
              description={
                <span className="paragraph-text paragraph-text--secondary">
                  {user.online ? 'online' : lastSeen(user.lastSeen)}
                </span>
              }
            />
            {isStreamIsLoading ? (
              <Button icon={<LoadingOutlined />} size="large" className="borderless" type="text" />
            ) : (
              <Button
                icon={<PhoneOutlined />}
                onClick={async () => await initCall(user)}
                size="large"
                className="borderless"
                type="text"
              />
            )}
            {ButtonWrapper(createChat, roomCreateLoader ? <LoadingOutlined /> : <MessageOutlined />, user, 'Open chat')}
            {ButtonWrapper(deleteUser, <CloseCircleOutlined />, user, 'Delete contact')}
          </List.Item>
        )}
      />
    </div>
  )
}

export default ContactList
