import { UserModel } from 'entities/user'
import { emitUserStatusToAll } from '../emitters'

export const setLastSeenData = async (userId: string) => {
  await UserModel.updateOne({ _id: userId }, { $set: { lastSeen: Date.now() } })
  emitUserStatusToAll(userId, false)
}
