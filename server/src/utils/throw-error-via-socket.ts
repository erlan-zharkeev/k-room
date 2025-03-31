import { io } from '../server'
import { getUserById } from '../socket'
import { IEventErrorMessage, ServerNotificationMessage, SocketActionsType } from '../@types'

export const throwErrorViaSocket = async (userId: string) => {
  const userData = await getUserById(userId)
  const payload: IEventErrorMessage = {
    message: ServerNotificationMessage.ImageConverterError
  }
  if (!userData?.socketId) return
  io.to(userData?.socketId).emit<SocketActionsType>('error-message', payload)
}
