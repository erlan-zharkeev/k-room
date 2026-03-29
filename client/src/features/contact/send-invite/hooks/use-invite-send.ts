import { EventInviteReceivedType, SocketActionsType } from 'common'

import { getRequiredContactSystemData } from 'src/features/contact'

import { useNotification } from 'src/entities/notification'

import { socket } from 'src/shared/api'
import { db } from 'src/shared/lib'

export const useInviteSend = () => {
  const { openBrowserNotification } = useNotification()

  const processInvitation = async (payload: EventInviteReceivedType) => {
    const existingContact = await db.contacts.get(payload.id)
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
    await db.contacts.put(data)
  }

  const monitorInvitation = () => {
    socket.on<SocketActionsType>('invite-received', async (payload: EventInviteReceivedType) => {
      processInvitation(payload)
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
