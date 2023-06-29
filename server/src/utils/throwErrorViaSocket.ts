import { SocketActionsPayload, SocketActions } from '../../../types'
import { io } from '../server'
import { getUserById } from '../socket/helpers/getters/getUserById'
import { ErrorMessages } from '../types/Messages'

export const throwErrorViaSocket = async (userId: string) => {
  const userData = await getUserById(userId)
  const payload: SocketActionsPayload['error-message'] = {
    message: ErrorMessages.imageConverterError
  }
  if (!userData?.socketId) return
  io.to(userData?.socketId).emit(SocketActions['error-message'], payload)
}
