import {
  EventInviteReceived,
  EventUpdateContactInteractionSuccess,
  EventUpdateInteraction,
  SocketActions
} from 'common'

import { getSocketsByUserIds } from 'src/modules/user'

import { SocketInstance } from 'src/shared/config'
import { getIO } from 'src/shared/lib/io'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { CONTACT_I18N } from '../i18n'

import { createContactInteraction } from './lib/create-contact-interaction'
import { deleteContactById } from './lib/delete-contact-by-id'
import { emitContactInteractionUpdated } from './lib/emit-contact-interaction-updated'
import { setContactInteraction } from './lib/set-contact-interaction'

export const updateContactInteractionTypeController = (socket: SocketInstance) => {
  socket.on<SocketActions>(
    'update-contact-interaction-type',
    socketErrorMiddleware(
      socket,
      async ({ contactId, interaction }: EventUpdateInteraction) => {
        const { userId } = socket.data
        const updateAuthorContactInteraction = async () => setContactInteraction(userId, contactId, interaction)
        const updateContactInteraction = async () => setContactInteraction(contactId, userId, interaction)

        const handleUpdateContactInteraction = async () => {
          const updatedContact = await updateContactInteraction()

          if (!updatedContact) return
          const contactSockets = await getSocketsByUserIds([updatedContact._id])
          contactSockets.forEach((socketId) => emitContactInteractionUpdated(socketId, userId, interaction))
        }

        switch (interaction) {
          case 'default': {
            await deleteContactById(userId, contactId, socket.id)
            await handleUpdateContactInteraction()
            break
          }
          case 'invited': {
            const contactData = await createContactInteraction(contactId, userId, 'invite-received')
            const authorData = await updateAuthorContactInteraction()
            if (!contactData || !authorData) return
            const { username, lastSeen, online } = authorData.public
            const payload: EventInviteReceived = {
              id: String(authorData._id),
              username,
              online,
              lastSeen,
              interactionType: 'invite-received'
            }
            const contactSockets = await getSocketsByUserIds([contactData._id])
            contactSockets.forEach((socketId) => {
              getIO().to(socketId).emit<SocketActions>('invite-received', payload)
            })
            break
          }
          case 'invite-accepted': {
            await updateAuthorContactInteraction()
            await handleUpdateContactInteraction()
            break
          }
        }

        const payload: EventUpdateContactInteractionSuccess = { contactId, interaction }
        getIO().to(socket.id).emit<SocketActions>('contact-interaction-updated', payload)
      },
      { basicError: CONTACT_I18N.updateContactInteractionFailed }
    )
  )
}
