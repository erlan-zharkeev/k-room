import { UserModel } from 'src/entities/user'

export const setLastSeenData = async (userId: string) => {
  const lastSeen = Date.now()
  await UserModel.updateOne({ _id: userId }, { $set: { 'public.lastSeen': lastSeen } })
  return lastSeen
}
