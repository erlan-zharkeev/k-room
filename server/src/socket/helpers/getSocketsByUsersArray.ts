import { UserModel } from './../../models/user.model'

export const getSocketsByUsersArray = async (usersIds: Array<String>) => {
  const users = await UserModel.find({ _id: { $in: usersIds } })
  return users.map((user) => user.socketId)
}

export default getSocketsByUsersArray
