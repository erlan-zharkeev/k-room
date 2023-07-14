import { SocketActions, SocketActionsPayload } from '../../../../../types'
import { CallModel } from '../../../models/call.model'
import { UserModel } from '../../../models/user.model'
import { io } from '../../../server'
import { transformCallDataForUser } from '../../../utils/transdusers/transformCallDataForUser'

export const emitCallsToUser = async (userId: string) => {
  const user = await UserModel.findOne({ _id: userId })
  if (!user) return
  const calls = await CallModel.find({ interlocutors: { $in: [userId] } })
  const callsWithDataPromises = calls.map(async (call) => {
    return transformCallDataForUser(userId, call._id)
  })
  const callsWithData = await Promise.all(callsWithDataPromises)
  const payload = callsWithData.filter((callData) => callData !== null) as SocketActionsPayload['callsUpdated']
  io.to(user.socketId).emit(SocketActions.CALLS_UPDATED, payload)
}

export default emitCallsToUser
