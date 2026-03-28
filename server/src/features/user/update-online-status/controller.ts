import { setUserStatus } from 'src/features/user'

export const updateOnlineStatus = async (userId: string, status: boolean, lastSeen?: number) => {
  await setUserStatus(userId, status, lastSeen)
}
