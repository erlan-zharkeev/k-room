import { EventInviteReceivedType, SocketActionsType } from 'common'

import { getRequiredContactSystemData } from 'src/features/contact'

import { useContact } from 'src/entities/contact'
import { useNotification } from 'src/entities/notification'

import { socket } from 'src/shared/api'

export const useInviteSend = () => {
  const { get, put } = useContact()
  const { openBrowserNotification } = useNotification()

  const processInvitation = async (payload: EventInviteReceivedType) => {
    const existingContact = await get(payload.id)
    const onlineStatusSyncedAt = Date.now()
    const data = existingContact
      ? {
          ...existingContact,
          ...payload,
          onlineStatusSyncedAt
        }
      : {
          ...payload,
          ...getRequiredContactSystemData()
        }
    await put(data)
  }

  const monitorInvitation = () => {
    socket.on<SocketActionsType>('invite-received', async (payload: EventInviteReceivedType) => {
      await processInvitation(payload)
      openBrowserNotification({
        message: {
          authorName: payload.username,
          body: 'Invite received'
        }
        // icon: payload.contactData.avatar
      })
    })
  }

  return { monitorInvitation }
}
