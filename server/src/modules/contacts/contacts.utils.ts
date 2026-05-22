import { CONTACT_LIMIT, REQ_STATUS, type UnknownObject } from 'global-shared'

import { AppError } from 'src/shared/lib/app-error'

import { CONTACTS_I18N } from './contacts.i18n'

export const assertContactLimit = (contacts: UnknownObject, contactId: string) => {
  if (contacts[contactId]) return

  if (Object.keys(contacts).length >= CONTACT_LIMIT) {
    throw new AppError(REQ_STATUS.badRequest, CONTACTS_I18N.contactLimitReached)
  }
}
