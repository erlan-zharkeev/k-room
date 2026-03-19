import { setUserStatus } from '../~shared'

export const updateOnlineStatus = async (userId: string, status: boolean) => {
  await setUserStatus(userId, status)
}
