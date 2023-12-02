import { UserModel } from '../../../models'

export const getUserById = async (userId: string) => await UserModel.findOne({ _id: userId })
