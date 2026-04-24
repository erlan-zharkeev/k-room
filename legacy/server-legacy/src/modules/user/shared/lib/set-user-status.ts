import { UserModel } from '../../user.model'

import { emitUserStatusToAll } from './emit-user-status-to-all'

export const setUserStatus = async (userId: string, status: boolean, lastSeen?: number) => {
  await UserModel.updateOne({ _id: userId }, { $set: { 'public.online': status } })
  await emitUserStatusToAll(userId, status, lastSeen)
}
