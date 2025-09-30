import { EventInviteReceivedType, IEventUpdateContactInteractionSuccess, IEventUpdateInteraction, SocketActionsType } from 'common-types'
import { getSocketsByUserIds } from 'features/user/~shared/lib/get-sockets-by-ids'
import { SocketInstanceType } from 'shared-config'
import { getIO, throwSocketError } from 'shared-lib'

import { deleteContactById, setContactInteraction } from './lib'
import { createContactInteraction } from './lib/create-contact-interaction'
import { emitContactInteractionUpdated } from './lib/emit-contact-interaction-updated'


export const controller = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'update-contact-interaction-type',
    async ({ contactId, interaction }: IEventUpdateInteraction) => {
      const { userId } = socket.data
      try {
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
      } catch {
        throwSocketError(socket.id)
      }
    }
  )
}


