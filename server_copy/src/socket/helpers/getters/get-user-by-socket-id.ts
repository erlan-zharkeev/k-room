import { UserModel } from 'entities/user'

export const getUserBySocketId = async (socketId: string) => await UserModel.findOne({ socketId })
