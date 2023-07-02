import { UserModel } from '../../../models/user.model'
import emitUserStatusToAll from '../emitters/emitUserStatusToAll'

export const setLastSeenData = async (userId: string) => {
  await UserModel.updateOne({ _id: userId }, { $set: { lastSeen: Date.now() } })
  emitUserStatusToAll(userId, false)
}

export default setLastSeenData
