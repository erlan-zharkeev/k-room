import { io } from '../../../app/server'
import type { IUserData, SocketActionsType } from 'common-types'

export const emitSearchedContacts = (socketId: string, contacts: Array<IUserData>) => {
  io.to(socketId).emit<SocketActionsType>('get-searched-contact', contacts)
}
