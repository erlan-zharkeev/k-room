import { List } from 'antd'
import { SocketActionsPayload, SocketActions, UserSettingKey, AsideBarButtonName, KRoomUser } from 'common-types'
import moment from 'moment'
import { useContext, useState, useEffect } from 'react'
import { UIAvatar, UIButton } from 'src/components'
import { useUpdateSettings, useTypedSelector } from 'src/hooks'
import { AdditionalServiceContext } from 'src/providers'
import { $socket } from 'src/services'
import { ContactSearch } from './components'

export const ContactList = () => {
  const { updateSetting } = useUpdateSettings()
  const { call } = useContext(AdditionalServiceContext)
  const { contacts } = useTypedSelector((state) => state.contacts)
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const { id, username, avatarPath } = useTypedSelector((state) => state.user.userData)
  const { settings } = useTypedSelector((state) => state.calls)
  const [loaders, setLoaders] = useState({ room: {}, stream: {} } as {
    room: Record<string, boolean>
    stream: Record<string, boolean>
  })

  useEffect(() => {
    contacts.forEach((contact) => {
      loaderStateChangeHandler(false, 'room', contact.id)
      loaderStateChangeHandler(false, 'stream', contact.id)
    })
  }, [contacts])

  const deleteUser = (interlocutorData: KRoomUser) => {
    if (!interlocutorData.id) return
    const payload: SocketActionsPayload['deleteContact'] = { deletingUserId: interlocutorData.id }
    $socket.emit(SocketActions.DELETE_CONTACT, payload)
  }

  const createChat = (value: KRoomUser) => {
    if (loaders.room[value.id]) return
    const hasChatWithContact = chatRooms.some((room) => {
      if (room.multiple) return
      const user = room.users.find((user) => user.id === value.id)
      if (user?.id) {
        updateSetting(UserSettingKey.asideTab, { asideTab: AsideBarButtonName.chatList })
        updateSetting(UserSettingKey.selectedChatRoomId, { selectChatRoomId: room.id })
      }
      return Boolean(user)
    })
    if (hasChatWithContact) return
    const contactId = value.id
    const contactName = value.username

    const hasUsersData = contactId && contactName && id && username
    if (!hasUsersData) return

    loaderStateChangeHandler(true, 'room', value.id)
    const socketPayload: SocketActionsPayload['createRoom'] = {
      chatName: contactName,
      users: [id, contactId],
      multiple: false
    }
    $socket.emit(SocketActions.CREATE_ROOM, socketPayload)

    $socket.on(SocketActions.ROOM_CREATED, (data) => {
      loaderStateChangeHandler(false, 'room', value.id)
      updateSetting(UserSettingKey.asideTab, { asideTab: AsideBarButtonName.chatList })
      setTimeout(() => {
        updateSetting(UserSettingKey.selectedChatRoomId, { selectChatRoomId: data.roomId })
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

  const initCall = async (interlocutorData: KRoomUser) => {
    if (loaders.stream[interlocutorData.id]) return
    loaderStateChangeHandler(true, 'stream', interlocutorData.id)
    await call.current.initCall(interlocutorData, id, avatarPath ?? '', username, settings)
    loaderStateChangeHandler(false, 'stream', interlocutorData.id)
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
                onClick={async () => await initCall(user)}
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
