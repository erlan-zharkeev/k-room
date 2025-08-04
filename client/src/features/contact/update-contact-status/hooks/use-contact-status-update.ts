import { SocketActionsType, IEventStatusContact } from 'common-types'

import { socket } from 'src/shared/api'

import { useUpdateContactData } from '../../update-contact-data'

export const useContactStatusUpdate = () => {
  const { updateContactData } = useUpdateContactData()

  const updateStatus = (payload: IEventStatusContact) => {
    const { interlocutorId, online, onlineStatusSyncedAt } = payload
    updateContactData(interlocutorId, { online, onlineStatusSyncedAt })
  }

  const monitorContactStatusUpdate = () => {
    socket.on<SocketActionsType>('contact-status-updated', updateStatus)
  }
  return { monitorContactStatusUpdate }
}
