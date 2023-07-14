import { SocketActionsPayload, SocketActions } from '../../../types'
import { UserModel } from '../models/user.model'
import { io } from '../server'
import { transformCallDataForUser } from './transdusers/transformCallDataForUser'

export const emitCallsDataToInterlocutors = (interlocutors: Array<string>, callId: string) => {
  interlocutors.forEach(async (interlocutorId) => {
    const transformedCallData = await transformCallDataForUser(interlocutorId, callId)
    if (!transformedCallData) return null
    const user = await UserModel.findOne({ _id: interlocutorId })
    if (!user) return
    const payload: SocketActionsPayload['callUpdated'] = transformedCallData
    io.to(user.socketId).emit(SocketActions.CALLS_UPDATED, payload)
  })
}
