import { List } from 'antd'
import { User, SocketActions } from 'common-types'
import moment from 'moment'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { socket } from 'src/socket/socket'
import { AppDispatch } from 'src/store'
import ContactSearch from './Components/ContactSearch/ContactSearch'
import { changeAsideTab, selectChatRoom } from 'src/store/settingsSlice'
import $call from 'src/services/$call'
import UIAvatar from 'ui/UIAvatar'
import UIButton from 'ui/UIButton'

const ContactList = () => {
  const { contacts } = useTypedSelector((state) => state.contacts)
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const { id, username, avatar } = useTypedSelector((state) => state.user.userData)
  const [roomCreateLoader, setRoomCreateLoader] = useState(false)
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
    if (roomCreateLoader) return
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

  const lastSeen = (timeStamp: string | undefined) => {
    return timeStamp ? `last seen ${moment(Number(timeStamp)).startOf('minutes').fromNow()}` : ''
  }

  const initCall = async (interlocutorData: User) => {
    if (isStreamIsLoading) return
    setIsStreamIsLoading(true)
    const gotStream = await $call.setStream()
    setIsStreamIsLoading(false)
    if (gotStream) $call.initCall(interlocutorData, id, avatar, username)
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
              avatar={<UIAvatar online={user.online} src={user.avatar} />}
              title={<span>{user.username}</span>}
              description={
                <span className="paragraph-text paragraph-text--secondary">
                  {user.online ? 'online' : lastSeen(user.lastSeen)}
                </span>
              }
            />
            <div className="contact-list__controls">
              <UIButton
                iconName={isStreamIsLoading ? 'loader' : 'call'}
                color={isStreamIsLoading ? 'accent' : 'success'}
                onClick={async () => await initCall(user)}
              />
              <UIButton
                iconName={roomCreateLoader ? 'loader' : 'chats'}
                color={roomCreateLoader ? 'accent' : 'default'}
                onClick={() => createChat(user)}
              />
              <UIButton iconName="cross" onClick={() => deleteUser(user)} />
            </div>
          </List.Item>
        )}
      />
    </div>
  )
}

export default ContactList
