import { UserModel } from '../models'
import { io } from '../server'
import { EventCallUpdated, SocketActions } from '../@types'
import { transformCallDataForUser } from './transducers'

export const emitCallDataToInterlocutors = (interlocutors: Array<string>, callId: string, setId?: boolean) => {
  interlocutors.forEach(async (interlocutorId) => {
    const transformedCallData = await transformCallDataForUser(interlocutorId, callId)
    if (!transformedCallData) return null
    const user = await UserModel.findOne({ _id: interlocutorId })
    if (!user) return
    const payload: EventCallUpdated = {
      ...transformedCallData,
      setId
    }
    io.to(user.socketId).emit<SocketActions>('call-updated', payload)
  })
}
