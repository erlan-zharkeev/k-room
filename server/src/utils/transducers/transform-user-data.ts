import { ObjectId } from 'mongoose'
import { IUserSchema, KRoomUser } from '../../@types'

export const transformUserData = (user: IUserSchema): KRoomUser => {
  const { _id } = user as IUserSchema & { _id: ObjectId }
  return {
    id: _id.toString(),
    role: user.role,
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
