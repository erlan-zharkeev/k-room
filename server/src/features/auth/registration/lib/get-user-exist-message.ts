import { type AppLanguageType } from 'common'

import { USER_I18N } from 'src/features/user'

import { getLocalizedText } from 'src/shared/lib'

import { REGISTRATION_I18N } from './../config'

export const getUserExistMessage = (reason: string | null, language: AppLanguageType): string => {
  switch (reason) {
    case 'username':
      return getLocalizedText(USER_I18N.userWithCurrentNameAlreadyExist, language)
    case 'email':
      return getLocalizedText(USER_I18N.userWithCurrentEmailAlreadyExist, language)
    case 'id':
      return getLocalizedText(USER_I18N.userWithCurrentIdAlreadyExist, language)
    default:
      return getLocalizedText(REGISTRATION_I18N.failedRegistration, language)
  }
}
