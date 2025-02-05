import { List } from 'antd'
import { SocketActionsPayload, SocketActions, UserSettingKey, AsideBarButtonName, Contact, InteractionType } from 'common-types'
import moment from 'moment'
import { useContext, useEffect, useState } from 'react'
import { UIAvatar, UIButton } from 'src/components'
import { useUpdateSettings, useTypedSelector } from 'src/hooks'
import { AdditionalServiceContext } from 'src/providers'
import { $socket } from 'src/services'
import { ContactSearch } from './elements'
import { addContact, AppDispatch, updateContactInteractionType } from 'src/store'
import { useDispatch } from 'react-redux'

export const ContactList = () => {
  const { updateSetting } = useUpdateSettings()
  const { call } = useContext(AdditionalServiceContext)
  const { contacts } = useTypedSelector((state) => state.contacts)
  const { chatRooms } = useTypedSelector((state) => state.chatRooms)
  const { id, username, avatarPath } = useTypedSelector((state) => state.user.userData)
  const { settings } = useTypedSelector((state) => state.calls)
  const [loaders, setLoaders] = useState({ room: {}, stream: {}, invite: {} } as {
    room: Record<string, boolean>
    stream: Record<string, boolean>
    invite: Record<string, boolean>
  })
  const dispatch = useDispatch<AppDispatch>()

  const deleteUser = (interlocutorData: Contact) => {
    if (!interlocutorData.id) return
    const payload: SocketActionsPayload['deleteContact'] = { deletingUserId: interlocutorData.id }
    $socket.emit(SocketActions.DELETE_CONTACT, payload)
  }

  const createChat = (value: Contact) => {
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

    $socket.on(SocketActions.ROOM_CREATED, (data: SocketActionsPayload['roomCreated']) => {
      loaderStateChangeHandler(false, 'room', value.id)
      updateSetting(UserSettingKey.asideTab, { asideTab: AsideBarButtonName.chatList })
      setTimeout(() => {
        updateSetting(UserSettingKey.selectedChatRoomId, { selectChatRoomId: data.roomId })
      })
    })
  }

  const loaderStateChangeHandler = (value: boolean, type: 'room' | 'stream' | 'invite', id: string) => {
    const loadersClone = { ...loaders }
    loadersClone[type][id] = value
    setLoaders(loadersClone)
  }

  const lastSeen = (timeStamp: string | undefined) => {
    return timeStamp ? `last seen ${moment(Number(timeStamp)).startOf('minutes').fromNow()}` : ''
  }

  const initCall = async (interlocutorData: Contact) => {
    if (loaders.stream[interlocutorData.id]) return
    loaderStateChangeHandler(true, 'stream', interlocutorData.id)
    await call.current.initCall(interlocutorData, id, avatarPath ?? '', username, settings)
    loaderStateChangeHandler(false, 'stream', interlocutorData.id)
  }

  const inviteHandler = async (contactId: string) => {
    if (loaders.invite[contactId]) return
    loaderStateChangeHandler(true, 'invite', contactId)
    const interactionType = InteractionType.invited
    const payload: SocketActionsPayload['updateInteractionType'] = { contactId, interactionType }
    $socket.emit(SocketActions.UPDATE_CONTACT_INTERACTION_TYPE, payload)
    $socket.on(SocketActions.UPDATE_CONTACT_INTERACTION_TYPE_SUCCESS, () => {
      dispatch(updateContactInteractionType({ contactId, interactionType }))
    })
  }

  useEffect(() => {
    $socket.on(SocketActions.INVITE_RECEIVED, (payload: SocketActionsPayload['inviteReceived']) => {
      dispatch(addContact(payload))
    })
  }, [])

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
              {user.interactionType === 'default' && <UIButton text="Invite" border="common-border" size="large" onClick={() => inviteHandler(user.id)}
              />}
              {user.interactionType === 'invited' && <div className='contact-list__invited' >Invited</div>}
              {user.interactionType === 'invite-accepted' && <>
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
              </>}
              <UIButton iconName="cross" onClick={() => deleteUser(user)} tooltip="Delete User" />
            </div>
          </List.Item>
        )}
      />
    </div>
  )
}
