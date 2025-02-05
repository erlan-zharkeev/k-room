import { Contact, DBContactMap, InteractionType, IUserSchema } from '../../@types'

export const transformUsersToContacts = (users: Array<IUserSchema>, userData: DBContactMap) =>
  users.reduce((acc: Array<Contact>, user) => {
    const userContact = userData[user.id];
    acc.push({
      id: user.id,
      username: user.username,
      email: user.email,
      online: user.online,
      avatarPath: user.avatarPath ?? '',
      lastSeen: user.lastSeen ?? '',
      interactionType: userContact?.interactionType ?? InteractionType.default,
    })
    return acc
  }, [])
