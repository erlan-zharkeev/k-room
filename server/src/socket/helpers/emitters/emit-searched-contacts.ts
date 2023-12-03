import { io } from '../../../server'
import { KRoomUser, SocketActions } from '../../../@types'

export const emitSearchedContacts = (socketId: string, contacts: Array<KRoomUser>) => {
  io.to(socketId).emit(SocketActions.GET_SEARCHED_CONTACT, contacts)
}
