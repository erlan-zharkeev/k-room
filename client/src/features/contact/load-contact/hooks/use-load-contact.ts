import { SocketActionsType, EventGetContactsType } from 'common'

import { socket } from 'src/shared/api'
import { db } from 'src/shared/lib'

import { getRequiredContactSystemData } from '../..'

export const useLoadContacts = () => {
  const loadContacts = async (list: EventGetContactsType) => {
    const existingContacts = await db.contacts.toArray()
    const existingContactMap = new Map(existingContacts.map((contact) => [contact.id, contact] as const))
    const result = Object.entries(list).map(([_, data]) => {
      const existingContact = existingContactMap.get(data.id)

      return existingContact
        ? {
          ...existingContact,
          ...data,
          onlineStatusSyncedAt: Date.now()
        }
        : {
          ...data,
          ...getRequiredContactSystemData()
        }
    })

    await db.contacts.bulkPut(result)
  }

  const monitorContactsLoading = () => {
    socket.on<SocketActionsType>('contacts-loaded', loadContacts)
  }

  return { monitorContactsLoading }
}
