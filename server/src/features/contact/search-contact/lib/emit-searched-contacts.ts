import type { IFrontendContact, SocketActionsType } from 'common-types'
import { getIO } from 'shared-lib'


export const emitSearchedContacts = (socketId: string, contacts: IFrontendContact[]) => {
  getIO().to(socketId).emit<SocketActionsType>('get-searched-contact', contacts)
}
