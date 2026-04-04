import { SocketActionsType } from 'common'

import { useContact } from 'src/entities/contact'

import { socket } from 'src/shared/api'

export const useLoadContacts = () => {
  const { bulkPut } = useContact()

  const monitorContactsLoading = () => {
    socket.on<SocketActionsType>('contacts-loaded', bulkPut)
  }

  return { monitorContactsLoading }
}
