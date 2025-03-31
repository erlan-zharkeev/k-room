import { DBContactMapType, IUserSchema } from '../../@types'
import { transformUserToContact } from './transform-user-to-contact'

export const transformUsersToContacts = (users: Array<IUserSchema>, userData: DBContactMapType) =>
  users.map((user) => transformUserToContact(user, userData[user.id]))
