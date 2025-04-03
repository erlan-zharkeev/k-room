import './style.scss'
import { useContext, useEffect, useState } from 'react'

import { List } from 'antd'
import {
  SocketActionsType,
  ContactType,
  InteractionType,
  IEventCreateRoom,
  IEventRoomCreated,
  IEventUpdateInteraction
} from 'common-types'
import moment from 'moment'

import { DeleteContactBtn } from 'src/features/contact/delete-contact'
import { SearchContact } from 'src/features/contact/search-contact'

import { useSettings } from 'src/entities/settings'

import { socket } from 'src/shared/api'
import { useTypedSelector } from 'src/shared/lib'
import { AdditionalServiceContext } from 'src/shared/providers'
import { AppAvatar, AppIcon, AppButton } from 'src/shared/ui'

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

  const setChat = (roomId: string) => {
    updateSetting('selectedContentElement', { selectedContentElement: 'chat-list' })
    updateSetting('selectedChatRoomId', { selectChatRoomId: roomId })
  }

  const getPersonalChatRoomId = (contact: ContactType) => {
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
    const socketPayload: IEventCreateRoom = { contactId }
    socket.emit<SocketActionsType>('create-personal-room', socketPayload)

    const onRoomCreated = (data: IEventRoomCreated) => {
      loaderStateChangeHandler(false, 'room', contactId)
      setChat(data.roomId)
      socket.off('room-created', onRoomCreated)
    }

    socket.on<SocketActionsType>('room-created', onRoomCreated)
  }

  const clickChatBtnHandler = (contact: ContactType) => {
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

  const initCall = async (interlocutorData: ContactType) => {
    if (loaders.stream[interlocutorData.id]) return
    loaderStateChangeHandler(true, 'stream', interlocutorData.id)
    await call.current.initCall(interlocutorData, id, avatarPath ?? '', username, settings)
    loaderStateChangeHandler(false, 'stream', interlocutorData.id)
  }

  const updateInteractionType = (contactId: string, interaction: InteractionType) => {
    loaderStateChangeHandler(true, 'invite', contactId)
    const payload: IEventUpdateInteraction = { contactId, interaction }
    socket.emit<SocketActionsType>('update-contact-interaction-type', payload)
  }

  return (
    <div className="contact-list">
      <SearchContact />
      <div className="divider" />
      <List
        header={<div>Contacts</div>}
        itemLayout="horizontal"
        dataSource={contacts.filter((contact) => contact.interaction !== 'invite-hidden')}
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
                  {user.interaction === 'default' && (
                    <AppButton text="Invite" onClick={() => updateInteractionType(user.id, 'invited')} borderless />
                  )}
                  {user.interaction === 'invited' && <div className="contact-list__invited">Invited</div>}
                  {user.interaction === 'invite-accepted' && (
                    <>
                      <AppButton
                        prefixIconName={loaders.stream[user.id] ? 'loader' : 'call'}
                        onClick={async () => await initCall(user)}
                        tooltip="ICall"
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
                  {user.interaction === 'invite-received' && (
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
                  <DeleteContactBtn interaction={user.interaction} id={user.id} />
                </>
              )}
            </div>
          </List.Item>
        )}
      />
    </div>
  )
}
