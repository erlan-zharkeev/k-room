import { USER_I18N } from 'src/features/user'

import { IAppRequest } from 'src/shared/config'
import { getLocalizedText } from 'src/shared/lib'

import { REGISTRATION_I18N } from './../config'

export const getUserExistMessage = (reason: string | null, req: IAppRequest): string => {
  switch (reason) {
    case 'username':
      return getLocalizedText(USER_I18N.userWithCurrentNameAlreadyExist, req)
    case 'email':
      return getLocalizedText(USER_I18N.userWithCurrentEmailAlreadyExist, req)
    case 'id':
      return getLocalizedText(USER_I18N.userWithCurrentIdAlreadyExist, req)
    default:
      return getLocalizedText(REGISTRATION_I18N.failedRegistration, req)
  }
}
