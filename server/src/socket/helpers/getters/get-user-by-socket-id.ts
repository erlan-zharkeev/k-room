import { UserModel } from '../../../models'

export const getUserBySocketId = async (socketId: string) => await UserModel.findOne({ socketId })
