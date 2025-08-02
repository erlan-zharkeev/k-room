import { SocketActionsType, IEventInviteReceived } from 'common-types'

import { useNotification } from 'src/entities/notification'

import { socket } from 'src/shared/api'
import { db } from 'src/shared/lib'

import { REQUIRED_CONTACT_DATA } from '../../lib'

export const useInviteSend = () => {
  const { openBrowserNotification } = useNotification()

  const processInvitation = async (payload: IEventInviteReceived) => {
    const { contactData } = payload
    const existingContact = await db.contacts.get(contactData.id)
    const onlineStatusUpdatedTimestamp = Date.now()
    const data = existingContact
      ? {
          ...existingContact,
          ...contactData,
          onlineStatusUpdatedTimestamp
        }
      : {
          ...contactData,
          ...REQUIRED_CONTACT_DATA,
          onlineStatusUpdatedTimestamp
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
        icon: payload.contactData.avatarPath
      })
    })
  }

  return { monitorInvitation }
}
