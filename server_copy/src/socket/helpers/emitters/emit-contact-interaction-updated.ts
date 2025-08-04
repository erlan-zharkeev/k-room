import type { IEventUpdateContactInteractionSuccess, InteractionType, SocketActionsType } from 'common-types'
import { io } from '../../../app/server'

export const emitContactInteractionUpdated = (socketId: string, contactId: string, interaction: InteractionType) => {
  const payload: IEventUpdateContactInteractionSuccess = {
    contactId,
    interaction
  }
  io.to(socketId).emit<SocketActionsType>('contact-interaction-updated', payload)
}
