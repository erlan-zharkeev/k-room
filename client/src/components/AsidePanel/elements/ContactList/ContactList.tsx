import { List } from 'antd'
import {
  SocketActions,
  Contact,
  InteractionType,
  EventDeleteContact,
  EventCreateRoom,
  EventRoomCreated,
  EventUpdateInteractionType
} from 'common-types'
import moment from 'moment'
import { useContext, useEffect, useState } from 'react'
import { UIAvatar, UIButton, UIIcon } from 'src/components'
import { useUpdateSettings, useTypedSelector } from 'src/hooks'
import { AdditionalServiceContext } from 'src/providers'
import { $socket } from 'src/services'
import { ContactSearch } from './elements'

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

  useEffect(() => {
    const updatedContacts = contacts.filter((contact) => loaders.invite[contact.id])
    if (updatedContacts.length > 0) {
      const newLoaders = { ...loaders }
      updatedContacts.forEach((contact) => {
        newLoaders.invite[contact.id] = false
      })
      setLoaders(newLoaders)
    }
  }, [contacts])

  const deleteUserHandler = (interlocutorData: Contact) => {
    if (!interlocutorData.id) return
    const payload: EventDeleteContact = { deletingUserId: interlocutorData.id }
    $socket.emit<SocketActions>('delete-contact', payload)
  }

  const changeBocksSelections = (roomId: string) => {
    updateSetting('asideTab', { asideTab: 'chat-list' })
    updateSetting('selectedChatRoomId', { selectChatRoomId: roomId })
  }

  const getPersonalChatRoomId = (contact: Contact) => {
    let result = null
    chatRooms.forEach((room) => {
      if (room.multiple) return
      const user = room.users.find((user) => user.id === contact.id)
      if (user) result = room.id
    })
    return result
  }

  const createChat = (contactId: string, contactName: string) => {
    loaderStateChangeHandler(true, 'room', contactId)

    const socketPayload: EventCreateRoom = {
      chatName: contactName,
      users: [id, contactId],
      multiple: false
    }

    $socket.emit<SocketActions>('create-room', socketPayload)

    let updateSelectedChatRoomTimeoutId: NodeJS.Timeout | null = setTimeout(() => {
      updateSetting('selectedChatRoomId', { selectChatRoomId: 'timeout' })
    })

    const onRoomCreated = (data: EventRoomCreated) => {
      loaderStateChangeHandler(false, 'room', contactId)
      updateSetting('asideTab', { asideTab: 'chat-list' })

      if (updateSelectedChatRoomTimeoutId) {
        clearTimeout(updateSelectedChatRoomTimeoutId)
        updateSelectedChatRoomTimeoutId = null
      }

      updateSetting('selectedChatRoomId', { selectChatRoomId: data.roomId })
      $socket.off('room-created', onRoomCreated)
    }

    $socket.on<SocketActions>('room-created', onRoomCreated)
  }

  const clickChatBtnHandler = (contact: Contact) => {
    if (loaders.room[contact.id]) return
    const personalChatRoomId = getPersonalChatRoomId(contact)
    if (personalChatRoomId) {
      changeBocksSelections(personalChatRoomId)
      return
    }
    createChat(contact.id, contact.username)
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

  const updateInteractionType = (contactId: string, interactionType: InteractionType) => {
    loaderStateChangeHandler(true, 'invite', contactId)
    const payload: EventUpdateInteractionType = { contactId, interactionType }
    $socket.emit<SocketActions>('update-contact-interaction-type', payload)
  }

  return (
    <div className="contact-list">
      <ContactSearch />
      <div className="divider" />
      <List
        header={<div>Contacts</div>}
        itemLayout="horizontal"
        dataSource={contacts.filter((contact) => contact.interactionType !== 'invite-hidden')}
        locale={{
          emptyText: <div className="paragraph-text paragraph-text--secondary">There are no contacts yet</div>
        }}
        renderItem={(user) => (
          <List.Item className="contact-list__list-item">
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
              {loaders.invite[user.id] ? (
                <UIIcon name="loader" color="accent" />
              ) : (
                <>
                  {user.interactionType === 'default' && (
                    <UIButton
                      text="Invite"
                      border="common-border"
                      onClick={() => updateInteractionType(user.id, 'invited')}
                    />
                  )}
                  {user.interactionType === 'invited' && <div className="contact-list__invited">Invited</div>}
                  {user.interactionType === 'invite-accepted' && (
                    <>
                      <UIButton
                        iconName={loaders.stream[user.id] ? 'loader' : 'call'}
                        onClick={() => initCall(user)}
                        tooltip="Call"
                      />
                      <UIButton
                        iconName={loaders.room[user.id] ? 'loader' : 'chat'}
                        onClick={() => clickChatBtnHandler(user)}
                        tooltip="Create Chat"
                      />
                    </>
                  )}
                  {user.interactionType === 'invite-received' && (
                    <>
                      <UIButton
                        className="contact-list__btn"
                        text="Accept"
                        color="accent"
                        border="common-border"
                        onClick={() => updateInteractionType(user.id, 'invite-accepted')}
                      />
                      <UIButton
                        className="contact-list__btn"
                        text="Decline"
                        color="error"
                        border="common-border"
                        onClick={() => updateInteractionType(user.id, 'default')}
                      />
                      <UIButton
                        className="contact-list__btn"
                        text="Hide"
                        border="common-border"
                        onClick={() => updateInteractionType(user.id, 'invite-hidden')}
                      />
                    </>
                  )}
                  {user.interactionType !== 'invite-received' && (
                    <UIButton iconName="cross" onClick={() => deleteUserHandler(user)} tooltip="Delete User" />
                  )}
                </>
              )}
            </div>
          </List.Item>
        )}
      />
    </div>
  )
}
