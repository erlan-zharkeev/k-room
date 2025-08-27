import { IFrontendUserData } from 'common-types'
import { IUserSchema } from 'entities/user'

export const mapUserToDto = (user: IUserSchema): IFrontendUserData => {
  const { id } = user
  const { role, infoNotifications } = user.personal
  const { email, username } = user.public

  return {
    id,
    role,
    email,
    username,
    infoNotifications,
    textRooms: [],
    contacts: []
  }
}
