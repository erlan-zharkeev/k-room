import './style.scss'
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
import { useTypedSelector } from 'src/shared/lib'
import { ContactSearch } from './elements'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/app/store'
import { AppAvatar, AppIcon, AppButton } from 'src/shared/ui'
import { AdditionalServiceContext } from 'src/shared/providers'
import { socket } from 'src/shared/api'
import { showModal, closeModal } from 'src/entities/system'
import { useSettings } from 'src/entities/settings'

export const ContactList = () => {
  const { updateSetting } = useSettings()
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

  const dispatch = useDispatch<AppDispatch>()

  const deleteUserHandler = (interlocutorData: Contact) => {
    dispatch(
      showModal({
        title: 'Confirmation',
        textContent: 'Are you sure you want to delete this contact?',
        confirmBtn: {
          text: 'Delete',
          callback: () => deleteContactConfirmed(interlocutorData)
        }
      })
    )
  }

  const deleteContactConfirmed = (interlocutorData: Contact) => {
    if (!interlocutorData.id) return
    const payload: EventDeleteContact = { deletingUserId: interlocutorData.id }
    socket.emit<SocketActions>('delete-contact', payload)
    dispatch(closeModal())
  }

  const setChat = (roomId: string) => {
    updateSetting('selectedContentElement', { selectedContentElement: 'chat-list' })
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

  const createChat = (contactId: string) => {
    loaderStateChangeHandler(true, 'room', contactId)
    const socketPayload: EventCreateRoom = { contactId }
    socket.emit<SocketActions>('create-personal-room', socketPayload)

    const onRoomCreated = (data: EventRoomCreated) => {
      loaderStateChangeHandler(false, 'room', contactId)
      setChat(data.roomId)
      socket.off('room-created', onRoomCreated)
    }

    socket.on<SocketActions>('room-created', onRoomCreated)
  }

  const clickChatBtnHandler = (contact: Contact) => {
    if (loaders.room[contact.id]) return
    const personalChatRoomId = getPersonalChatRoomId(contact)
    if (personalChatRoomId) {
      setChat(personalChatRoomId)
      return
    }
    createChat(contact.id)
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
    socket.emit<SocketActions>('update-contact-interaction-type', payload)
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
          emptyText: <div className="paragraph-text ">There are no contacts yet</div>
        }}
        renderItem={(user) => (
          <List.Item className="contact-list__list-item">
            <List.Item.Meta
              avatar={<AppAvatar showBadge={false} src={user.avatarPath} />}
              title={<span>{user.username}</span>}
              description={
                <span className="paragraph-text paragraph-text--sm ">
                  {user.online ? 'online' : lastSeen(user.lastSeen)}
                </span>
              }
            />
            <div className="contact-list__controls">
              {loaders.invite[user.id] ? (
                <AppIcon name="loader" color="accent-color" />
              ) : (
                <>
                  {user.interactionType === 'default' && (
                    <AppButton text="Invite" onClick={() => updateInteractionType(user.id, 'invited')} borderless />
                  )}
                  {user.interactionType === 'invited' && <div className="contact-list__invited">Invited</div>}
                  {user.interactionType === 'invite-accepted' && (
                    <>
                      <AppButton
                        prefixIconName={loaders.stream[user.id] ? 'loader' : 'call'}
                        onClick={() => initCall(user)}
                        tooltip="Call"
                        borderless
                      />
                      <AppButton
                        prefixIconName={loaders.room[user.id] ? 'loader' : 'chat'}
                        onClick={() => clickChatBtnHandler(user)}
                        tooltip="Create Chat"
                        borderless
                      />
                    </>
                  )}
                  {user.interactionType === 'invite-received' && (
                    <>
                      <AppButton
                        additionalClassName="contact-list__btn"
                        text="Accept"
                        color="accent-color"
                        onClick={() => updateInteractionType(user.id, 'invite-accepted')}
                      />
                      <AppButton
                        additionalClassName="contact-list__btn"
                        text="Decline"
                        color="error-color"
                        borderless
                        onClick={() => updateInteractionType(user.id, 'default')}
                      />
                      <AppButton
                        additionalClassName="contact-list__btn"
                        text="Hide"
                        borderless
                        onClick={() => updateInteractionType(user.id, 'invite-hidden')}
                      />
                    </>
                  )}
                  {user.interactionType !== 'invite-received' && (
                    <AppButton
                      prefixIconName="cross"
                      onClick={() => deleteUserHandler(user)}
                      tooltip="Delete contact"
                      borderless
                    />
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
