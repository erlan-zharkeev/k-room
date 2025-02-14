import { io } from '../../../server'
import { KRoomUser, SocketActions } from '../../../@types'

export const emitSearchedContacts = (socketId: string, contacts: Array<KRoomUser>) => {
  io.to(socketId).emit<SocketActions>('get-searched-contact', contacts)
}
