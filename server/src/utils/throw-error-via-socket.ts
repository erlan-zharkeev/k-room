import { io } from '../server'
import { getUserById } from '../socket'
import { SocketActionsPayload, NotificationMessage, SocketActions } from '../@types'

export const throwErrorViaSocket = async (userId: string) => {
  const userData = await getUserById(userId)
  const payload: SocketActionsPayload['errorMessage'] = {
    message: NotificationMessage.imageConverterError
  }
  if (!userData?.socketId) return
  io.to(userData?.socketId).emit(SocketActions.ERROR_MESSAGE, payload)
}
