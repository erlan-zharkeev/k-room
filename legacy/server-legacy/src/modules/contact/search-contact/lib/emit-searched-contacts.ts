import { EventGetSearchedContact, SocketActions } from 'common'

import { getIO } from 'src/shared/lib/io'

export const emitSearchedContacts = (socketId: string, payload: EventGetSearchedContact) => {
  getIO().to(socketId).emit<SocketActions>('get-searched-contact', payload)
}
