import { emitUserStatusToAll } from 'features/user/~shared/lib/emit-user-status-to-all'

import { UserModel } from 'entities/user'

export const setUserStatus = async (userId: string, status: boolean, lastSeen?: number) => {
  await UserModel.updateOne({ _id: userId }, { $set: { 'public.online': status } })
  await emitUserStatusToAll(userId, status, lastSeen)
}
