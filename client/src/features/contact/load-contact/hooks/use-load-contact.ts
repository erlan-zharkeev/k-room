import { SocketActionsType, EventGetContactsType } from 'common-types'

import { getRequiredContactSystemData } from 'src/features/contact/~shared/lib'

import { socket } from 'src/shared/api'
import { db } from 'src/shared/lib'

export const useLoadContacts = () => {
  const loadContacts = async (list: EventGetContactsType) => {
    const result = Object.entries(list).map(([_, data]) => {
      return { ...data, ...getRequiredContactSystemData() }
    })
    await db.contacts.bulkPut(result)
  }

  const monitorContactsLoading = () => {
    socket.on<SocketActionsType>('contacts-loaded', loadContacts)
  }

  return { monitorContactsLoading }
}
