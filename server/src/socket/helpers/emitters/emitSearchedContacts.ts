import { io } from '../../../server'
import { User, SocketActions } from '../../../../../types'

export const emitSearchedContacts = (socketId: string, contacts: Array<User>) => {
  io.to(socketId).emit(SocketActions['get-searched-contact'], contacts)
}

export default emitSearchedContacts
