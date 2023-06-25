import { UserModel } from '../../../models/user.model'

export const getSocketsByUserIds = async (usersIds: Array<string>) => {
  const users = await UserModel.find({ _id: { $in: usersIds } })
  return users.map((user) => user.socketId)
}

export default getSocketsByUserIds
