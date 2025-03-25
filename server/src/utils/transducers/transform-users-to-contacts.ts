import { DBContactMap, IUserSchema } from '../../@types'
import { transformUserToContact } from './transform-user-to-contact'

export const transformUsersToContacts = (users: Array<IUserSchema>, userData: DBContactMap) =>
  users.map((user) => transformUserToContact(user, userData[user.id]))
