import { ObjectId } from 'mongoose'
import type { IUserSchema, IFrontendUserData } from 'common-types'

export const transformUserData = (user: IUserSchema): IFrontendUserData => {
  const { _id } = user as IUserSchema & { _id: ObjectId }
  return {
    id: _id.toString(),
    role: user.role,
    username: user.username,
    avatar: user.avatar,
    email: user.email,
    online: user.online ?? false,
    chatRooms: user.chatRooms ?? []
  }
}

export const transformUsersData = (users: Array<IUserSchema>): Array<IFrontendUserData> => {
  return users.map((user) => {
    return transformUserData(user)
  })
}
