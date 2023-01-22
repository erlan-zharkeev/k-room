import { UserModel } from './../../models/user.model'
import emitUserStatusToAll from './emitUserStatusToAll'
const ObjectIdType = require('mongoose').Types.ObjectId

export const setLastSeenData = async (userId: string | typeof ObjectIdType) => {
  await UserModel.updateOne({ _id: userId }, { $set: { lastSeen: Date.now() } })
  emitUserStatusToAll(userId, false)
}

export default setLastSeenData
