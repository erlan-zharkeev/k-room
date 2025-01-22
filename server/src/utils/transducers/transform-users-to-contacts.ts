import { Contact, KRoomUser } from '../../@types'

export const transformUsersToContacts = (users: Array<KRoomUser>) =>
  users.reduce((acc: Array<Contact>, user) => {
    acc.push({
      id: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
      online: user.online,
      avatarPath: user.avatarPath ?? '',
      lastSeen: user.lastSeen ?? ''
    })
    return acc
  }, [])
