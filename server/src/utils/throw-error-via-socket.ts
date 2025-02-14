import { io } from '../server'
import { getUserById } from '../socket'
import { EventErrorMessage, SocketActions } from '../@types'
import { ServerNotificationMessage } from '../@enums'

export const throwErrorViaSocket = async (userId: string) => {
  const userData = await getUserById(userId)
  const payload: EventErrorMessage = {
    message: ServerNotificationMessage.ImageConverterError
  }
  if (!userData?.socketId) return
  io.to(userData?.socketId).emit<SocketActions>('error-message', payload)
}
