import { useContext, useState } from 'react'

import { ContactType } from 'common-types'
import { settings } from 'firebase/analytics'

import { useContact } from 'src/entities/contact'
import { useUser } from 'src/entities/user'

import { AdditionalServiceContext } from 'src/shared/providers'

export const useContactList = () => {
  const { call } = useContext(AdditionalServiceContext)
  const { contacts } = useContact()
  const contactList = contacts.filter((contact) => contact.interaction !== 'invite-hidden')

  const { id, username, avatarPath } = useUser()

  const [loaders, setLoaders] = useState({ room: {}, stream: {} } as {
    room: Record<string, boolean>
    stream: Record<string, boolean>
  })

  const loaderStateChangeHandler = (value: boolean, type: 'room' | 'stream', id: string) => {
    const loadersClone = { ...loaders }
    loadersClone[type][id] = value
    setLoaders(loadersClone)
  }

  const initCall = async (interlocutorData: ContactType) => {
    if (loaders.stream[interlocutorData.id]) return
    loaderStateChangeHandler(true, 'stream', interlocutorData.id)
    await call.current.initCall(interlocutorData, id, avatarPath ?? '', username, settings)
    loaderStateChangeHandler(false, 'stream', interlocutorData.id)
  }

  // const createChatRoomHandler = (contactId: string) => {
  //   const payload = {
  //     formData: { contactIds: [contactId] },
  //     createChatCB: () => loaderStateChangeHandler(true, 'room', contactId),
  //     onRoomCreatedCB: () => loaderStateChangeHandler(false, 'room', contactId)
  //   }
  //   createChatRoom(payload)
  // }

  // const getPersonalChatRoomId = (contact: ContactType) => {
  //   let result = null
  //   chatRooms.forEach((room) => {
  //     if (room.multiple) return
  //     const user = room.users.find((user) => user.id === contact.id)
  //     if (user) result = room.id
  //   })
  //   return result
  // }

  // const clickChatBtnHandler = (contact: ContactType) => {
  //   if (loaders.room[contact.id]) return
  //   const personalChatRoomId = getPersonalChatRoomId(contact)
  //   if (personalChatRoomId) {
  //     selectChatWithAsideById(personalChatRoomId)
  //     return
  //   }
  //   createChatRoomHandler(contact.id)
  // }

  return { contactList, loaders, initCall }
}
