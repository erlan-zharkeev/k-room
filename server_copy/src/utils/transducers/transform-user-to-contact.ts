import type { DBContactType, ContactType, IUserSchema } from 'common-types'

export const transformUserToContact = (user: IUserSchema, userContact: DBContactType): ContactType => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    online: user.online,
    avatar: user.avatar ?? '',
    lastSeen: user.lastSeen,
    interaction: userContact?.interaction ?? 'default'
  }
}
