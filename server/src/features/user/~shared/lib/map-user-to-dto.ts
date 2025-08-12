import { IFrontendUserData } from 'common-types'
import { IUserSchema } from 'entities/user'

export const mapUserToDto = (user: IUserSchema): IFrontendUserData => {
  const { id } = user
  const { role, unreadInfoNotifications } = user.personal
  const { email, username, avatar } = user.public
  return {
    id,
    role,
    email,
    username,
    avatar,
    unreadInfoNotifications,
    textRooms: [],
    contacts: []
  }
}
