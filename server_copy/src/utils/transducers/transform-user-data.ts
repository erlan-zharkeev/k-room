import { ObjectId } from 'mongoose'
import type { IUserSchema, IUserData } from 'common-types'

export const transformUserData = (user: IUserSchema): IUserData => {
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

export const transformUsersData = (users: Array<IUserSchema>): Array<IUserData> => {
  return users.map((user) => {
    return transformUserData(user)
  })
}
