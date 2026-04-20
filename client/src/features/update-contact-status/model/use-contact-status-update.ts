import { SocketActionsType, IEventStatusContact } from 'common'

import { useUpdateContactData } from 'src/features/update-contact-data'

import { socket } from 'src/shared/api'

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
