import { AppLanguageType } from 'common'

import { USER_I18N } from 'src/features/user'

import { localizedText } from 'src/shared/lib'

import { REGISTRATION_I18N } from './../config'

export const getUserExistMessage = (reason: string | null, language: AppLanguageType): string => {
  switch (reason) {
    case 'username':
      return localizedText(USER_I18N.userWithCurrentNameAlreadyExist, language)
    case 'email':
      return localizedText(USER_I18N.userWithCurrentEmailAlreadyExist, language)
    case 'id':
      return localizedText(USER_I18N.userWithCurrentIdAlreadyExist, language)
    default:
      return localizedText(REGISTRATION_I18N.failedRegistration, language)
  }
}
