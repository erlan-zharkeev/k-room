import { SocketActionsType, EventGetContactsType } from 'common-types'

import { socket } from 'src/shared/api'
import { db } from 'src/shared/lib'

import { REQUIRED_CONTACT_DATA } from '../../lib'

export const useLoadContacts = () => {
  const loadContacts = async (list: EventGetContactsType) => {
    const result = Object.entries(list).map(([_, data]) => {
      return { ...data, ...REQUIRED_CONTACT_DATA }
    })
    await db.contacts.bulkPut(result)
  }

  const monitorContactsLoading = () => {
    socket.on<SocketActionsType>('contacts-loaded', loadContacts)
  }

  return { monitorContactsLoading }
}
