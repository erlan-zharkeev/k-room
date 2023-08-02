import { UserModel } from '../../../models/user.model'
import emitUserStatusToAll from '../emitters/emitUserStatusToAll'

export const setUserStatus = async (userId: string, status: boolean) => {
  await UserModel.updateOne({ _id: userId }, { $set: { online: status } })
  emitUserStatusToAll(userId, true)
}

export default setUserStatus
