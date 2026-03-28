import { setUserStatus } from './../shared'

export const updateOnlineStatusController = async (userId: string, status: boolean, lastSeen?: number) => {
  await setUserStatus(userId, status, lastSeen)
}
