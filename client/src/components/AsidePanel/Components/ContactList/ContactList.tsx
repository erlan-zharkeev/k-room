import { List } from 'antd'
import { User, SocketActions, SocketActionsPayload } from 'common-types'
import moment from 'moment'
import { useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { socket } from 'src/socket/socket'
import { AppDispatch } from 'src/store'
import ContactSearch from './Components/ContactSearch/ContactSearch'
import { changeAsideTab, selectChatRoom } from 'src/store/settingsSlice'
import { ServiceContext } from 'src/main'
import { UIAvatar, UIButton } from 'src/components/UI'

const ContactList = () => {
  const { $call } = useContext(ServiceContext)
  const { contacts } = useTypedSelector((state) => state.contacts)
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const { id, username, avatarPath } = useTypedSelector((state) => state.user.userData)

  const [loaders, setLoaders] = useState({ room: {}, stream: {} } as {
    room: { [key: string]: boolean }
    stream: { [key: string]: boolean }
  })

  useEffect(() => {
    contacts.forEach((contact) => {
      loaderStateChangeHandler(false, 'room', contact.id)
      loaderStateChangeHandler(false, 'stream', contact.id)
    })
  }, [contacts])

  const dispatch = useDispatch<AppDispatch>()

  const deleteUser = (userData: User) => {
    if (userData.id && id)
      socket.emit(SocketActions['delete-contact'], { currentUserId: id, deletingUserId: userData.id })
  }

  const createChat = (value: User) => {
    if (loaders.room[value.id]) return
    const hasChatWithContact = chatRooms.some((room) => {
      if (room.multiple) return
      const user = room.users.find((user) => user.id === value.id)
      if (user?.id) {
        dispatch(changeAsideTab('chatList'))
        dispatch(selectChatRoom(room.id))
      }
      return Boolean(user)
    })
    if (hasChatWithContact) return
    const contactId = value.id
    const contactName = value.username

    const hasUsersData = contactId && contactName && id && username
    if (!hasUsersData) return

    loaderStateChangeHandler(true, 'room', value.id)
    const socketPayload: SocketActionsPayload['create-room'] = {
      users: [id, contactId],
      authorId: id,
      multiple: false
    }
    socket.emit(SocketActions['create-room'], socketPayload)

    socket.on(SocketActions['room-created'], (data) => {
      loaderStateChangeHandler(false, 'room', value.id)
      dispatch(changeAsideTab('chatList'))

      setTimeout(() => {
        dispatch(selectChatRoom(data.roomId))
      })
    })
  }

  const loaderStateChangeHandler = (value: boolean, type: 'room' | 'stream', id: string) => {
    const loadersClone = { ...loaders }
    loadersClone[type][id] = value
    setLoaders(loadersClone)
  }

  const lastSeen = (timeStamp: string | undefined) => {
    return timeStamp ? `last seen ${moment(Number(timeStamp)).startOf('minutes').fromNow()}` : ''
  }

  const initCall = async (interlocutorData: User) => {
    if (loaders.stream[interlocutorData.id]) return
    loaderStateChangeHandler(true, 'stream', interlocutorData.id)
    const gotStream = await $call.setStream()
    loaderStateChangeHandler(false, 'stream', interlocutorData.id)
    if (!avatarPath) return
    if (gotStream) $call.initCall(interlocutorData, id, avatarPath, username)
  }

  return (
    <div className="contact-list">
      <ContactSearch />
      <div className="divider" />
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
              avatar={<UIAvatar online={user.online} src={user.avatarPath} />}
              title={<span>{user.username}</span>}
              description={
                <span className="paragraph-text paragraph-text--sm paragraph-text--secondary">
                  {user.online ? 'online' : lastSeen(user.lastSeen)}
                </span>
              }
            />
            <div className="contact-list__controls">
              <UIButton
                iconName={loaders.stream[user.id] ? 'loader' : 'call'}
                onClick={() => initCall(user)}
                tooltip="Call"
              />
              <UIButton
                iconName={loaders.room[user.id] ? 'loader' : 'chat'}
                onClick={() => createChat(user)}
                tooltip="Create Chat"
              />
              <UIButton iconName="cross" onClick={() => deleteUser(user)} tooltip="Delete User" />
            </div>
          </List.Item>
        )}
      />
    </div>
  )
}

export default ContactList
