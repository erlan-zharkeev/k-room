import { UserModel } from 'src/entities/user'

import { emitUserStatusToAll } from './index'

export const setUserStatus = async (userId: string, status: boolean, lastSeen?: number) => {
  await UserModel.updateOne({ _id: userId }, { $set: { 'public.online': status } })
  await emitUserStatusToAll(userId, status, lastSeen)
}
