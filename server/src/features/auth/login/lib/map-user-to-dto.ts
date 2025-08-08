import { IUserSchema } from 'entities/user'

export const mapUserToDto = async (user: IUserSchema) => {
  const { id } = user
  const { role, unreadInfoNotifications } = user.personal
  const { email, username, avatarPath } = user.public
  return {
    userData: {
      id,
      role,
      email,
      username,
      avatarPath,
      unreadInfoNotifications
    }
  }
}
