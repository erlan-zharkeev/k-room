import { UserModel } from './../../models/user.model'
import emitUserStatusToAll from './emitUserStatusToAll'
const ObjectIdType = require('mongoose').Types.ObjectId

export const setUserStatus = async (userId: string | typeof ObjectIdType, status: boolean) => {
  await UserModel.updateOne({ _id: userId }, { $set: { online: status } })
  emitUserStatusToAll(userId, true)
}

export default setUserStatus
