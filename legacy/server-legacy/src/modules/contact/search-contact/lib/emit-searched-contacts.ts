import { IEventGetSearchedContact, SocketActionsType } from 'common'

import { getIO } from 'src/shared/lib/io'

export const emitSearchedContacts = (socketId: string, payload: IEventGetSearchedContact) => {
  getIO().to(socketId).emit<SocketActionsType>('get-searched-contact', payload)
}
