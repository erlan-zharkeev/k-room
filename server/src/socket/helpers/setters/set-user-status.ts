import { UserModel } from '../../../models'
import { emitUserStatusToAll } from '../emitters'

export const setUserStatus = async (userId: string, status: boolean) => {
  await UserModel.updateOne({ _id: userId }, { $set: { online: status } })
  emitUserStatusToAll(userId, true)
}
