import { AppLanguage } from 'common'

import { USER_I18N } from 'src/modules/user'

import { localizedText } from 'src/shared/lib/localized-text'

import { REGISTRATION_I18N } from '../config/i18n'

export const getUserExistMessage = (reason: string | null, language: AppLanguage): string => {
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
