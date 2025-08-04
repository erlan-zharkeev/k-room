import { UserModel } from 'entities/user'

export const getUserById = async (userId: string) => await UserModel.findOne({ _id: userId })
