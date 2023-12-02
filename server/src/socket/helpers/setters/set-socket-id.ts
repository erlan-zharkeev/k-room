import { UserModel } from '../../../models'

export const setSocketId = async (userId: string, socketId: string) =>
  await UserModel.updateOne({ _id: userId }, { $set: { socketId } })
