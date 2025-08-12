import { SocketActionsType, IEventInviteReceived } from 'common-types'

import { useNotification } from 'src/entities/notification'

import { socket } from 'src/shared/api'
import { db } from 'src/shared/lib'

import { getRequiredContactSystemData } from '../../lib'

export const useInviteSend = () => {
  const { openBrowserNotification } = useNotification()

  const processInvitation = async (payload: IEventInviteReceived) => {
    const { contactData } = payload
    const existingContact = await db.contacts.get(contactData.id)
    const onlineStatusSyncedAt = Date.now()
    const data = existingContact
      ? {
          ...existingContact,
          ...contactData,
          onlineStatusSyncedAt
        }
      : {
          ...contactData,
          ...getRequiredContactSystemData()
        }
    await db.contacts.put(data)
  }

  const monitorInvitation = () => {
    socket.on<SocketActionsType>('invite-received', async (payload: IEventInviteReceived) => {
      processInvitation(payload)
      openBrowserNotification({
        message: {
          authorName: payload.contactData.username,
          body: 'Invite received'
        },
        icon: payload.contactData.avatar
      })
    })
  }

  return { monitorInvitation }
}
