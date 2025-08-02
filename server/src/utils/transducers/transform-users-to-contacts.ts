import { DBContactMapType, EventGetContactsType, IUserSchema } from '../../@types'
import { transformUserToContact } from './transform-user-to-contact'

export const transformUsersToContacts = (
  users: Array<IUserSchema>,
  userData: DBContactMapType
): EventGetContactsType => {
  const result: EventGetContactsType = {}
  users.forEach((user) => {
    result[user.id] = transformUserToContact(user, userData[user.id])
  })
  return result
}
