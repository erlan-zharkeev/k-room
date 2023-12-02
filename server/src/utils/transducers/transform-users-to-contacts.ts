import { User } from '../../@types'

export const transformUsersToContacts = (users: Array<User>) =>
  users.reduce((acc: Array<any>, user) => {
    acc.push({
      id: user.id,
      username: user.username,
      email: user.email,
      online: user.online,
      avatarPath: user.avatarPath ?? '',
      lastSeen: user.lastSeen ?? ''
    })
    return acc
  }, [])
