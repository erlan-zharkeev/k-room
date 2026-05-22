import type { MongoId } from 'src/shared/config'

import { UserModel } from '../../user.model'

export const getSocketsByUserIds = async (ids: MongoId[]) => {
  const users = await UserModel.find({ _id: { $in: ids } }, { _id: 1, 'system.device': 1 }).lean()

  return users
    .map((user) => {
      const deviceIds = Object.keys(user.system.device)
      const socketIds = deviceIds.map((deviceId) => user.system.device[deviceId].socketId)
      return socketIds
    })
    .flat()
}
