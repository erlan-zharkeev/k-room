import { io } from '../../../app/server'
import type { IFrontendUserData, SocketActionsType } from 'common-types'

export const emitSearchedContacts = (socketId: string, contacts: Array<IFrontendUserData>) => {
  io.to(socketId).emit<SocketActionsType>('get-searched-contact', contacts)
}
