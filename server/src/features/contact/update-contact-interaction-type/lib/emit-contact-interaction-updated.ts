import { IEventUpdateContactInteractionSuccess, InteractionType, SocketActionsType } from "common"

import { getIO } from "shared-lib"


export const emitContactInteractionUpdated = (socketId: string, contactId: string, interaction: InteractionType) => {
  const payload: IEventUpdateContactInteractionSuccess = {
    contactId,
    interaction
  }
  getIO().to(socketId).emit<SocketActionsType>('contact-interaction-updated', payload)
}
