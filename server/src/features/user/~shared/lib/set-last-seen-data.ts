import { UserModel } from 'entities/user'

import { emitUserStatusToAll } from './emit-user-status-to-all'

export const setLastSeenData = async (userId: string) => {
  await UserModel.updateOne({ _id: userId }, { $set: { 'public.lastSeen': Date.now() } })
  await emitUserStatusToAll(userId, false)
}
