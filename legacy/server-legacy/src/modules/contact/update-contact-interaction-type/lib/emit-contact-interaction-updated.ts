import { EventUpdateContactInteractionSuccess, Interaction, SocketActions } from 'common'

import { getIO } from 'src/shared/lib/io'

export const emitContactInteractionUpdated = (socketId: string, contactId: string, interaction: Interaction) => {
  const payload: EventUpdateContactInteractionSuccess = {
    contactId,
    interaction
  }
  getIO().to(socketId).emit<SocketActions>('contact-interaction-updated', payload)
}
