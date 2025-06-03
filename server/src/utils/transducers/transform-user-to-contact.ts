import { DBContactType, ContactType, IUserSchema } from '../../@types'

export const transformUserToContact = (user: IUserSchema, userContact: DBContactType): ContactType => ({
  id: user.id,
  username: user.username,
  email: user.email,
  online: user.online,
  avatarPath: user.avatarPath ?? '',
  lastSeen: user.lastSeen,
  interaction: userContact?.interaction ?? 'default'
})
