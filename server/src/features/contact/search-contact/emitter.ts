import type { FrontendContactType, SocketActionsType } from 'common-types'
import { getIO } from 'shared-lib'


export const emitSearchedContacts = (socketId: string, contacts: FrontendContactType[]) => {
  getIO().to(socketId).emit<SocketActionsType>('get-searched-contact', contacts)
}
