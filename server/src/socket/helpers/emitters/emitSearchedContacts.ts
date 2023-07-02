import { io } from '../../../server'
import { User, SocketActions } from '../../../../../types'

export const emitSearchedContacts = (socketId: string, contacts: Array<User>) => {
  io.to(socketId).emit(SocketActions.GET_SEARCHED_CONTACT, contacts)
}

export default emitSearchedContacts
