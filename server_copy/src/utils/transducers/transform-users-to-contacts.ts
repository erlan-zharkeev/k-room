import type { DBContactMapType, EventGetContactsType, IUserSchema } from 'common-types'
import { transformUserToContact } from './transform-user-to-contact'

export const transformUsersToContacts = (users: Array<IUserSchema>, userData: DBContactMapType) => {
  const result: EventGetContactsType = {}
  users.forEach((user) => {
    result[user.id] = transformUserToContact(user, userData[user.id])
  })
  return result
}
