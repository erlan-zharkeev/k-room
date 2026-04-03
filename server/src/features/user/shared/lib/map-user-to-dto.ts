import { IFrontendUserData } from 'common'

import { IUserSchema } from 'src/entities/user'

export const mapUserToDto = (user: IUserSchema): IFrontendUserData => {
  const { _id } = user
  const { email } = user.personal
  const { username } = user.public
  const { role } = user.system

  return {
    id: _id,
    role,
    email,
    username
  }
}
