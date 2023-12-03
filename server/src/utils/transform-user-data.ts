import { IUserSchema } from '../models'
import { KRoomUser } from '../@types'

export const transformUserData = (user: IUserSchema): KRoomUser => {
  return {
    id: user._id,
    username: user.username,
    avatarPath: user.avatarPath,
    email: user.email,
    online: user.online ?? false,
    chatRooms: user.chatRooms ?? []
  }
}

export const transformUsersData = (users: Array<IUserSchema>): Array<KRoomUser> => {
  return users.map((user) => {
    return transformUserData(user)
  })
}
