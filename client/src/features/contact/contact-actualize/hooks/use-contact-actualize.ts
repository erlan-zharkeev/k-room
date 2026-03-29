import { IFrontendContact, SocketActionsType } from 'common'

import { getRequiredContactSystemData } from 'src/features/contact'

import { socket } from 'src/shared/api'
import { DbContactType } from 'src/shared/config'
import { db } from 'src/shared/lib'

export const useContactActualize = () => {
  const actualizeContacts = async (contacts: IFrontendContact[]) => {
    await db.transaction('rw', db.contacts, async () => {
      const existingContacts = await db.contacts.toArray()
      const existingContactMap = new Map(existingContacts.map((contact) => [contact.id, contact] as const))
      const nextContacts = contacts.map((contact) => {
        const existingContact = existingContactMap.get(contact.id)

        return existingContact
          ? {
            ...existingContact,
            ...contact,
            onlineStatusSyncedAt: Date.now()
          }
          : {
            ...contact,
            ...getRequiredContactSystemData()
          }
      })

      await db.contacts.clear()
      if (nextContacts.length) {
        await db.contacts.bulkPut(nextContacts as DbContactType[])
      }
    })
  }

  const monitorContactsActualize = () => {
    socket.on<SocketActionsType>('actual-contacts', actualizeContacts)
  }

  return { monitorContactsActualize }
}
