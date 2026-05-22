import { IFrontendUserData } from 'common'

import { UserSchema } from '../../types'

export const mapUserToDto = (user: UserSchema): IFrontendUserData => {
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
