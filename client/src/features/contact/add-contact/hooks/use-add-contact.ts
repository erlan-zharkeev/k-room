import { IEventContactAddSuccess, IUserData, SocketActionsType } from 'common-types'

import { useUser } from 'src/entities/user'

import { socket } from 'src/shared/api'
import { db } from 'src/shared/lib'

import { REQUIRED_CONTACT_DATA } from '../../lib'

export const useAddContact = () => {
  const { id } = useUser()

  const clickAddContactHandler = async (interlocutorId: string | undefined, searchedContacts: IUserData[]) => {
    if (!interlocutorId) return
    const interlocutorData = searchedContacts.find((user) => user.id === interlocutorId)
    if (!interlocutorData) return
    socket.emit<SocketActionsType>('save-contact', { userId: id, interlocutorId: interlocutorData.id })
  }

  const addContact = async (payload: IEventContactAddSuccess) => {
    const newContact = { ...payload.contactData, ...REQUIRED_CONTACT_DATA }
    await db.contacts.put(newContact)
  }

  const monitorContactAdding = () => {
    socket.on<SocketActionsType>('contact-add-success', addContact)
  }

  return {
    clickAddContactHandler,
    monitorContactAdding,
    addContact
  }
}
