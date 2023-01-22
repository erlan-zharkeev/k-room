import { UserModel } from './../../models/user.model'
import { UserShort } from './../../../../types'

export const getOnlineUsersByIdsArray = async (users: Array<UserShort>) => {
  const usersArray = users.map((user) => user.id)
  const result = await UserModel.find({
    _id: { $in: usersArray },
    online: true
  })
  return result
}

export default getOnlineUsersByIdsArray
