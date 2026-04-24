import { setUserStatus } from '../shared/lib/set-user-status'

export const updateOnlineStatusController = async (userId: string, status: boolean, lastSeen?: number) => {
  await setUserStatus(userId, status, lastSeen)
}
