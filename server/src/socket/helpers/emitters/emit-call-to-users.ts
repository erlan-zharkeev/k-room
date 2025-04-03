import { UserModel, CallModel } from '../../../models'
import { io } from '../../../server'
import { EventCallsUpdatedType, SocketActionsType } from '../../../@types'
import { transformCallDataForUser } from '../../../utils'

export const emitCallsToUser = async (userId: string) => {
  const user = await UserModel.findOne({ _id: userId })
  if (!user) return
  const calls = await CallModel.find({ interlocutors: { $in: [userId] } })
  const callsWithDataPromises = calls.map(async (call) => await transformCallDataForUser(userId, call._id))
  const callsWithData = await Promise.all(callsWithDataPromises)
  const payload = callsWithData.filter((callData) => callData !== null) as EventCallsUpdatedType
  io.to(user.socketId).emit<SocketActionsType>('calls-data-loaded', payload)
}
