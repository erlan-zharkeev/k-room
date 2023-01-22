import { UserModel } from './../../models/user.model'

export const getUserBySocketId = async (socketId: string) => await UserModel.findOne({ socketId })

export default getUserBySocketId
