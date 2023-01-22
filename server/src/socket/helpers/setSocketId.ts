import { UserModel } from './../../models/user.model'

export const setSocketId = async (userId: string, socketId: string) => {
  await UserModel.updateOne({ _id: userId }, { $set: { socketId } })
}

export default setSocketId
