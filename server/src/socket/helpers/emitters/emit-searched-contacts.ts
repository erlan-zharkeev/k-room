import { io } from '../../../server'
import { IUserData, SocketActionsType } from '../../../@types'

export const emitSearchedContacts = (socketId: string, contacts: Array<IUserData>) => {
  io.to(socketId).emit<SocketActionsType>('get-searched-contact', contacts)
}
