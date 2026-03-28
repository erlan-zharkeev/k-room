import { emitUserStatusToAll } from 'src/features/user'

import { UserModel } from 'src/entities/user'

export const setUserStatus = async (userId: string, status: boolean, lastSeen?: number) => {
  await UserModel.updateOne({ _id: userId }, { $set: { 'public.online': status } })
  await emitUserStatusToAll(userId, status, lastSeen)
}
