import { IFrontendContact, SocketActionsType } from 'common-types'
import { UserModel } from 'entities/user'
import { getSocketsByUserIds } from 'features/user'
import { SocketInstanceType } from 'shared-config'
import { getIO, throwSocketError } from 'shared-lib'

import { transformUserToFrontendContact } from './lib'

export const controller = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('get-actual-contacts', async () => {
    const { userId } = socket.data
    try {
      const data = await UserModel.findById(userId).lean()
      const contacts = data?.personal.contacts
      let result: IFrontendContact[] = []
      if (contacts) {
        result = await transformUserToFrontendContact(contacts)
      }
      const sockets = await getSocketsByUserIds([userId])
      sockets.forEach(socketId => {
        getIO().to(socketId).emit<SocketActionsType>('actual-contacts', result)
      })
    } catch {
      throwSocketError(socket.id)
    }
  })
}