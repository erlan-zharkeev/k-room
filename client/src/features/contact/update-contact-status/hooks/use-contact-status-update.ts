import { SocketActionsType, IEventStatusContact } from 'common'

import { socket } from 'src/shared/api'

import { useUpdateContactData } from '../../update-contact-data'

export const useContactStatusUpdate = () => {
  const { updateContactData } = useUpdateContactData()

  const updateStatus = (payload: IEventStatusContact) => {
    const { interlocutorId, online, onlineStatusUpdatedTimestamp, lastSeen } = payload
    updateContactData(interlocutorId, {
      online,
      lastSeen,
      onlineStatusSyncedAt: onlineStatusUpdatedTimestamp
    })
  }

  const monitorContactStatusUpdate = () => {
    socket.on<SocketActionsType>('contact-status-updated', updateStatus)
  }
  return { monitorContactStatusUpdate }
}
