import { DBContact, Contact, IUserSchema } from '../../@types'

export const transformUserToContact = (user: IUserSchema, userContact: DBContact): Contact => ({
  id: user.id,
  username: user.username,
  email: user.email,
  online: user.online,
  avatarPath: user.avatarPath ?? '',
  lastSeen: user.lastSeen ?? '',
  interactionType: userContact?.interactionType ?? 'default'
})
