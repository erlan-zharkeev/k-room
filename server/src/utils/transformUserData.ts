import { User } from '../../../types'
import { IUserSchema } from '../models/user.model'

const transformUserData = (user: IUserSchema): User => {
  return {
    id: user._id,
    username: user.username,
    avatarPath: user.avatarPath,
    email: user.email,
    online: user.online ?? false,
    chatRooms: user.chatRooms ?? []
  }
}

const transformUsersData = (users: Array<IUserSchema>): Array<User> => {
  return users.map((user) => {
    return transformUserData(user)
  })
}

export { transformUserData, transformUsersData }
