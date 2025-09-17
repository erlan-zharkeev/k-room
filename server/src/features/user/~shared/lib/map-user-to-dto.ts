import { IFrontendUserData } from 'common-types'
import { IUserSchema } from 'entities/user'

export const mapUserToDto = (user: IUserSchema): IFrontendUserData => {
  const { id } = user
  const { email, infoNotifications } = user.personal
  const { username } = user.public
  const { role } = user.system

  return {
    id,
    role,
    email,
    username,
    infoNotifications,
    textRooms: [],
    contacts: {}
  }
}
