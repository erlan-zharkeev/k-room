import {
  EventInviteReceivedType,
  IEventUpdateContactInteractionSuccess,
  IEventUpdateInteraction,
  SocketActionsType
} from 'common'

import { getSocketsByUserIds } from 'src/features/user'

import { SocketInstanceType } from 'src/shared/config'
import { getIO } from 'src/shared/lib'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { CONTACT_I18N } from './../config'
import {
  createContactInteraction,
  deleteContactById,
  emitContactInteractionUpdated,
  setContactInteraction
} from './lib'

export const updateContactInteractionTypeController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'update-contact-interaction-type',
    socketErrorMiddleware(
      socket,
      async ({ contactId, interaction }: IEventUpdateInteraction) => {
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
            const payload: EventInviteReceivedType = {
              id: String(authorData._id),
              username,
              online,
              lastSeen,
              interactionType: 'invite-received'
            }
            const contactSockets = await getSocketsByUserIds([contactData._id])
            contactSockets.forEach((socketId) => {
              getIO().to(socketId).emit<SocketActionsType>('invite-received', payload)
            })
            break
          }
          case 'invite-accepted': {
            await updateAuthorContactInteraction()
            await handleUpdateContactInteraction()
            break
          }
        }

        const payload: IEventUpdateContactInteractionSuccess = { contactId, interaction }
        getIO().to(socket.id).emit<SocketActionsType>('contact-interaction-updated', payload)
      },
      { basicError: CONTACT_I18N.updateContactInteractionFailed }
    )
  )
}
