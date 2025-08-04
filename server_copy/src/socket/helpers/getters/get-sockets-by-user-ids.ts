import { UserModel } from 'entities/user'

export const getSocketsByUserIds = async (usersIds: Array<string>) => {
  const users = await UserModel.find({ _id: { $in: usersIds } })
  return users.map((user) => user.socketId)
}
