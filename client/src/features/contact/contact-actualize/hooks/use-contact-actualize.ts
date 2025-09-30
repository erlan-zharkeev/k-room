import { IFrontendContact, SocketActionsType } from 'common-types'

import { socket } from 'src/shared/api'
import { DbContactType } from 'src/shared/config'
import { db } from 'src/shared/lib'

export const useContactActualize = () => {
  const getActualContacts = () => {
    socket.emit<SocketActionsType>('get-actual-contacts')
  }

  const actualizeContacts = async (contacts: IFrontendContact[]) => {
    await db.transaction('rw', db.contacts, async () => {
      await db.contacts.clear()
      if (contacts?.length) {
        await db.contacts.bulkPut(contacts as DbContactType[])
      }
    })
  }

  const monitorContactsActualize = () => {
    getActualContacts()
    socket.on<SocketActionsType>('actual-contacts', actualizeContacts)
  }

  return { monitorContactsActualize }
}
